
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
      // Construct an absolute URL with origin for the reset link
      const baseUrl = window.location.origin;
      const resetUrl = `${baseUrl}/reset-password`;
      console.log('Using reset URL:', resetUrl);
      
      // First try the standard Supabase method with our configured redirect URL
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });
      
      if (error) {
        console.error('Password reset request error from Supabase:', error);
        
        // If Supabase fails, try our backup edge function method
        try {
          console.log('Trying edge function for password reset');
          // Construct the reset link to include in the email
          const resetLink = `${resetUrl}?email=${encodeURIComponent(email)}`;
          
          const edgeFunctionResponse = await supabase.functions.invoke('send-email', {
            body: {
              type: 'reset_password',
              email: email,
              recipient: email,
              template: 'reset_password',
              resetLink: resetLink,
              // Add timestamp to help with tracking
              timestamp: new Date().toISOString()
            }
          });
          
          if (edgeFunctionResponse.error) {
            throw new Error(edgeFunctionResponse.error.message || 'Error sending email via edge function');
          }
          
          console.log('Password reset via edge function response:', edgeFunctionResponse);
          return { success: true, method: 'edge_function' };
        } catch (edgeError: any) {
          console.error('Edge function password reset error:', edgeError);
          throw error; // Throw the original Supabase error if both methods fail
        }
      }
      
      console.log('Password reset request successful via Supabase');
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
