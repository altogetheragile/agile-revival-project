
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandler';

export function usePasswordReset() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localResetEmailSent, setLocalResetEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const initiatePasswordReset = async (email: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      console.log(`Initiating password reset for: ${email}`);
      
      // Show loading toast immediately
      toast({
        title: "Processing",
        description: "Sending password reset link..."
      });

      if (!email || typeof email !== 'string' || email.trim() === '') {
        throw new Error('Please enter a valid email address');
      }
      
      // Set the reset URL to the current site's reset password page
      const resetUrl = `${window.location.origin}/reset-password`;
      console.log(`Using reset URL: ${resetUrl}`);
      
      // Call Supabase directly to reset password with all available options
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: resetUrl,
        captchaToken: undefined
      });
      
      if (supabaseError) {
        console.error('Supabase password reset error:', supabaseError);
        // We'll still show a success message for security reasons (don't reveal if email exists)
        throw supabaseError;
      }
      
      console.log('Password reset request successful');
      
      // Show success toast
      toast({
        title: "Email sent",
        description: "If an account exists with this email, you'll receive reset instructions."
      });
      
      setLocalResetEmailSent(true);
      return { success: true };
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // For security, we still show a success message even on error
      toast({
        title: "Email sent",
        description: "If an account exists with this email, you'll receive reset instructions."
      });
      
      // But we'll set the error for debugging purposes
      setError(error.message || "An unexpected error occurred");
      
      // Still mark as sent for security reasons
      setLocalResetEmailSent(true);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const completePasswordReset = async (newPassword: string) => {
    try {
      setIsSubmitting(true);
      console.log('Attempting to update password...');
      
      if (!newPassword || newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        throw error;
      }

      console.log('Password updated successfully');
      toast({
        title: "Success",
        description: "Your password has been updated successfully"
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Password update error:', error);
      setError(error.message || "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to update password"
      });
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
