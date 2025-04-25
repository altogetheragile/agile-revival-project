
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
    try {
      // Construct the redirect URL for consistency
      const baseUrl = window.location.origin;
      const resetUrl = `${baseUrl}/reset-password`;
      console.log('Reset URL being used:', resetUrl);
      
      // Use Supabase's built-in password reset with redirectTo
      console.log('Using Supabase built-in password reset');
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl
      });
      
      if (error) {
        console.error('Password reset error from Supabase:', error);
        throw error;
      }
      
      // If successful, also try to trigger our custom email for better deliverability
      try {
        console.log('Also sending via edge function for better deliverability');
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'reset_password',
            email: email,
            recipient: email,
            template: 'reset_password',
            // Note: We don't specify resetLink here as we want the edge function
            // to use the Supabase-generated reset link if possible
            timestamp: new Date().toISOString()
          }
        });
      } catch (edgeError: any) {
        // Just log this error but don't fail - the official Supabase reset should still work
        console.warn('Edge function additional email failed but Supabase reset should work:', edgeError);
      }
      
      console.log('Password reset request successful');
      return { success: true, method: 'supabase' };
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  };
  
  const updatePassword = async (newPassword: string) => {
    console.log('Updating password');
    try {
      // Check if we have a valid session before updating
      const { data: sessionData } = await supabase.auth.getSession();
      
      console.log('Session check for password update:', 
        sessionData.session ? 'Session found' : 'No active session');
      
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
      return { success: true };
    } catch (error: any) {
      console.error('Password update failed:', error);
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
