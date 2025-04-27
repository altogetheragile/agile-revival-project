
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandler';

export function usePasswordReset() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localResetEmailSent, setLocalResetEmailSent] = useState(false);
  const navigate = useNavigate();

  const initiatePasswordReset = async (email: string) => {
    try {
      setIsSubmitting(true);
      console.log(`Initiating password reset for: ${email}`);
      
      // Show loading toast immediately
      const toastId = toast.loading("Sending password reset link...");
      
      // Set the reset URL to the current site's reset password page
      const resetUrl = `${window.location.origin}/reset-password`;
      console.log(`Using reset URL: ${resetUrl}`);
      
      // Try direct Supabase method
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });
      
      if (supabaseError) {
        console.error('Supabase password reset error:', supabaseError);
        
        // Update loading toast to error but with a generic message for security
        toast.success("If an account exists with this email, you'll receive reset instructions.", {
          id: toastId,
        });
        
        throw supabaseError;
      }
      
      console.log('Password reset request successful');
      
      // Update loading toast to success
      toast.success("Reset link sent", {
        id: toastId,
        description: "If an account exists with this email, you'll receive reset instructions."
      });
      
      setLocalResetEmailSent(true);
      return { success: true };
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // For security, we still show a success message even on error
      toast.success("If an account exists with this email, you'll receive reset instructions.");
      
      setError(error.message);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const completePasswordReset = async (newPassword: string) => {
    try {
      setIsSubmitting(true);
      console.log('Attempting to update password...');
      
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        throw error;
      }

      console.log('Password updated successfully');
      toast.success('Your password has been updated successfully');
      
      return { success: true };
    } catch (error: any) {
      console.error('Password update error:', error);
      setError(error.message);
      toast.error('Failed to update password');
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    localResetEmailSent,
    setLocalResetEmailSent,
    initiatePasswordReset,
    completePasswordReset,
    navigate
  };
}
