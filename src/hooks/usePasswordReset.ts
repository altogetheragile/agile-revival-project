
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleAuthError } from '@/utils/errorHandler';
import { toast } from 'sonner';

export function usePasswordReset() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePasswordReset = async (email: string) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log(`[Password Reset] Initiating reset for: ${email}`);
      
      const resetUrl = `${window.location.origin}/reset-password`;
      console.log('[Password Reset] Using reset URL:', resetUrl);
      
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl
      });
      
      if (supabaseError) throw supabaseError;
      
      // For security reasons, always show success message regardless of email existence
      toast.success("If an account exists with this email, you'll receive reset instructions.");
      
      return { success: true };
    } catch (error: any) {
      console.error('[Password Reset] Error:', error);
      
      const handledError = handleAuthError(error);
      setError(handledError.message);
      
      // Even if there's an error, we don't reveal if the email exists for security
      toast.success("If an account exists with this email, you'll receive reset instructions.");
      
      return { success: false, error: handledError };
    } finally {
      setIsSubmitting(false);
    }
  };

  const completePasswordReset = async (newPassword: string) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('[Password Reset] Attempting to update password');
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        throw new Error('No active session. Please request a new password reset link.');
      }
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      console.log('[Password Reset] Password updated successfully');
      
      toast.success("Your password has been reset successfully. You can now log in with your new password.");
      
      return { success: true };
    } catch (error: any) {
      console.error('[Password Reset] Error updating password:', error);
      
      const handledError = handleAuthError(error);
      setError(handledError.message);
      
      toast.error(handledError.message);
      
      return { success: false, error: handledError };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    setError,
    initiatePasswordReset,
    completePasswordReset
  };
}
