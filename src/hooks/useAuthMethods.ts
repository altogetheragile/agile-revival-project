
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAuthMethods() {
  const signIn = async (email: string, password: string) => {
    console.log('Signing in with email:', email);
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    
    console.log('Sign in successful');
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    console.log('Signing up with email:', email);
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });
    
    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }
    
    console.log('Sign up successful:', data);
    
    toast.success("Please check your email to confirm your account.");
    
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    
    console.log('Sign out successful');
  };

  const resetPassword = async (email: string) => {
    console.log('Resetting password for:', email);
    
    if (!email) {
      throw new Error('Email is required');
    }
    
    try {
      // Try to use our edge function first
      try {
        console.log('Attempting password reset via edge function');
        const { error: edgeFunctionError } = await supabase.functions.invoke('send-password-reset', {
          body: { 
            email: email.trim(),
            redirectUrl: `${window.location.origin}/reset-password`
          }
        });
        
        if (edgeFunctionError) {
          console.error('Edge function reset error:', edgeFunctionError);
          // Fall back to direct method
        } else {
          console.log('Password reset via edge function successful');
          return { success: true };
        }
      } catch (edgeFunctionError) {
        console.error('Edge function call failed:', edgeFunctionError);
        // Fall back to direct method
      }
      
      // Try to reset password directly with Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }
      
      console.log('Password reset email sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    console.log('Updating password');
    
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('No active session found. Please request a new password reset link.');
    }
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error('Password update error:', error);
      throw error;
    }
    
    console.log('Password updated successfully');
    
    toast.success("Your password has been changed successfully.");
    
    return { success: true };
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };
}
