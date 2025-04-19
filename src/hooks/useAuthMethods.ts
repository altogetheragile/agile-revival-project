
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

export function useAuthMethods() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const MAX_RETRIES = 2;
  const INITIAL_TIMEOUT = 10000;

  const handleError = (error: any) => {
    console.error('Authentication error:', error);
    
    let message = error.message || "An error occurred during authentication";
    
    if (error.status === 504 || error.message?.includes('timeout') || error.message === '{}' || error.name === 'AbortError') {
      message = "The server is taking too long to respond. This could be due to high traffic or connectivity issues. Please try again later.";
    } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      message = "Network error. Please check your internet connection and try again.";
    } else if (error.message?.includes('already registered')) {
      message = "Email already registered. Please use another email or try logging in.";
    } else if (error.message?.includes('password')) {
      message = "Invalid password. Please check your password and try again.";
    } else if (error.message?.includes('provider is not enabled')) {
      message = "Google authentication is not configured. Please contact the administrator.";
    } else if (error.message?.includes('Email not confirmed')) {
      message = "Please confirm your email address before logging in. Check your email for a confirmation link.";
    }
    
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Starting email sign in process...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        throw error;
      }
      
      console.log("Sign in successful:", data.user?.email);
      
      toast({
        title: "Login successful",
        description: "You have been successfully logged in.",
      });

    } catch (error: any) {
      console.error('Sign in error:', error);
      handleError(error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    let attempt = 0;
    let lastError: any = null;

    while (attempt <= MAX_RETRIES) {
      const timeout = INITIAL_TIMEOUT * (attempt + 1);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        console.log(`Sign up attempt ${attempt + 1} for: ${email}`);
        
        const signUpPromise = supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });

        const abortPromise = new Promise((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            reject(new Error(`Request timed out after ${timeout}ms. Attempt ${attempt + 1}/${MAX_RETRIES + 1}`));
          });
        });

        const result = await Promise.race([signUpPromise, abortPromise]) as any;
        clearTimeout(timeoutId);

        if (result?.error) throw result.error;

        console.log("Sign up successful:", result.data.user?.email);
        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        });
        return result;
      } catch (error: any) {
        lastError = error;
        clearTimeout(timeoutId);
        console.error(`Sign up attempt ${attempt + 1} failed:`, error.message);

        if (attempt < MAX_RETRIES) {
          toast({
            title: "Retrying...",
            description: `Attempt ${attempt + 2} of ${MAX_RETRIES + 1}`,
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        attempt++;
      }
    }

    const errorMsg = lastError?.message || "Failed to create account after multiple attempts";
    console.error("Sign up failed after all attempts:", errorMsg);
    toast({
      title: "Error",
      description: errorMsg,
      variant: "destructive",
    });
    throw new Error(errorMsg);
  };

  const signOut = async () => {
    try {
      console.log("Starting logout process...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Sign out successful");
      navigate('/auth');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error("Sign out error:", error.message);
      toast({
        title: "Error",
        description: "There was a problem logging out.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
  };
}
