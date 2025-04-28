
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
        title: "Sending",
        description: "Sending password reset link..."
      });
      
      // Set the reset URL to the current site's reset password page
      const resetUrl = `${window.location.origin}/reset-password`;
      console.log(`Using reset URL: ${resetUrl}`);
      
      // Call Supabase directly to reset password
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });
      
      if (supabaseError) {
        console.error('Supabase password reset error:', supabaseError);
        // We'll still show a success message for security reasons (don't reveal if email exists)
        toast({
          title: "Email sent",
          description: "If an account exists with this email, you'll receive reset instructions."
        });
        
        // But still throw the error for debugging
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
