
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAuthMethods() {
  const signIn = async (email: string, password: string) => {
    console.log('Signing in with email:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
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

  // Using usePasswordReset hook for password reset functionality
  // This is handled by the dedicated hook to avoid duplication

  const updatePassword = async (newPassword: string) => {
    console.log('Updating password');
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
    updatePassword
  };
}
