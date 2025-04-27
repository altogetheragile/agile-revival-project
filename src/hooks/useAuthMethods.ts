
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAuthMethods() {
  const signIn = async (email: string, password: string) => {
    console.log('Signing in with email:', email);
    toast.loading("Signing in...");
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success("Signed in successfully", {
        id: "signin"
      });
      console.log('Sign in successful');
    } catch (error: any) {
      toast.error("Sign in failed", {
        id: "signin",
        description: error.message
      });
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    console.log('Signing up with email:', email);
    toast.loading("Creating your account...");
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Registration successful", {
        id: "signup",
        description: "Please check your email to verify your account."
      });
      
      console.log('Sign up successful:', data);
      return data;
    } catch (error: any) {
      toast.error("Registration failed", {
        id: "signup",
        description: error.message
      });
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    toast.loading("Signing out...");
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success("Signed out successfully", {
        id: "signout"
      });
      console.log('Sign out successful');
    } catch (error: any) {
      toast.error("Sign out failed", {
        id: "signout",
        description: error.message
      });
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    console.log('Requesting password reset for:', email);
    toast.loading("Sending password reset email...");
    
    try {
      const resetUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl
      });
      
      if (error) throw error;
      
      toast.success("Password reset email sent", {
        id: "reset",
        description: "Check your inbox for a password reset link"
      });
      console.log('Password reset request successful');
    } catch (error: any) {
      // For security, don't reveal if the email exists or not
      toast.success("Password reset email sent", {
        id: "reset",
        description: "If an account exists with this email, you'll receive reset instructions"
      });
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    console.log('Updating password');
    toast.loading("Updating your password...");
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        throw new Error('No active session found. Please request a new password reset link.');
      }
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully", {
        id: "updatepw",
        description: "You can now sign in with your new password"
      });
      console.log('Password updated successfully');
      return { success: true };
    } catch (error: any) {
      toast.error("Password update failed", {
        id: "updatepw",
        description: error.message
      });
      console.error('Password update error:', error);
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };
}
