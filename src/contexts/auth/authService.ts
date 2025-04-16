
import { supabase } from "@/integrations/supabase/client";
import { ResetPasswordResult } from "./types";
import { useToast } from "@/components/ui/use-toast";

export const useAuthService = () => {
  const { toast } = useToast();

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<ResetPasswordResult> => {
    try {
      // Define the full URL for password reset
      const redirectUrl = `${window.location.origin}/auth?tab=login`;
      console.log("Reset password redirect URL:", redirectUrl);
      
      // Add a timeout to the promise to prevent infinite waiting
      const resetPromise = supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      // Set a timeout of 10 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Password reset request timed out. This might be due to network issues or the Supabase service being temporarily unavailable."));
        }, 10000);
      });
      
      // Race between the actual request and the timeout
      const { error } = await Promise.race([
        resetPromise,
        timeoutPromise,
      ]) as any;

      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Please check your inbox and spam folder for the password reset link.",
      });
      
      return { 
        success: true, 
        message: "If an account exists with this email, you will receive password reset instructions." 
      };
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      // Check if it's a timeout error
      if (error.message && error.message.includes("timed out")) {
        toast({
          title: "Password reset request issue",
          description: "The request timed out. Please try again later or contact support if the problem persists.",
          variant: "destructive",
        });
        
        return {
          success: false,
          message: "Request timed out. Please try again later."
        };
      } else {
        // For other errors, we still show a generic message to prevent user enumeration
        toast({
          title: "Password reset request sent",
          description: "If an account exists with this email, you will receive password reset instructions.",
        });
        
        // Return success even on error to prevent user enumeration
        return { 
          success: true,
          message: "If an account exists with this email, you will receive password reset instructions."
        };
      }
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword
  };
};
