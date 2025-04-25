
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    console.log('Requesting password reset for:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
    
    console.log('Password reset email sent successfully');
  };
  
  const updatePassword = async (newPassword: string) => {
    console.log('Updating password');
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error('Password update error:', error);
      throw error;
    }
    
    console.log('Password updated successfully');
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };
}
