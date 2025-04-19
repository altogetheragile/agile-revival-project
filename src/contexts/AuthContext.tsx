import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const MAX_RETRIES = 2;
  const INITIAL_TIMEOUT = 10000; // 10 seconds

  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        // Update session and user state synchronously
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Defer Supabase calls using setTimeout to prevent deadlocks
        if (currentSession?.user) {
          console.log("User authenticated, checking admin status");
          setTimeout(() => {
            checkAdminStatus(currentSession.user.id);
          }, 0);
        } else {
          console.log("User not authenticated, setting isAdmin to false");
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    console.log("Checking for existing session");
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log("Found existing session, checking admin status");
        checkAdminStatus(currentSession.user.id);
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (userId: string) => {
    console.log("Checking admin status for user:", userId);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      const hasAdminRole = !!data;
      console.log("Admin check result:", { hasAdminRole, data });
      setIsAdmin(hasAdminRole);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };
  
  const refreshAdminStatus = async (): Promise<void> => {
    if (user?.id) {
      console.log("Manually refreshing admin status for:", user.email);
      await checkAdminStatus(user.id);
      console.log("Admin status after refresh:", isAdmin);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("Sign in successful:", data.user?.email);
      // Auth state change listener will handle updating the user state
    } catch (error: any) {
      console.error("Sign in error:", error.message);
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
      console.log("Signing out user");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Sign out successful");
      navigate('/auth');
    } catch (error: any) {
      console.error("Sign out error:", error.message);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    isAdmin,
    refreshAdminStatus
  };
  
  console.log("AuthContext state:", { 
    user: user?.email, 
    isAdmin,
    userId: user?.id
  });
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
