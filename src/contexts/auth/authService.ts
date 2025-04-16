
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
      
      const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

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
      
      toast({
        title: "Password reset request sent",
        description: "If an account exists with this email, you will receive password reset instructions.",
      });
      
      // Return success even on error to prevent user enumeration
      return { 
        success: false, 
        message: error.message || "An unexpected error occurred" 
      };
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword
  };
};
