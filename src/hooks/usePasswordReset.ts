
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      
      // Use a success toast regardless of whether the email exists in the database
      // This is a security measure to prevent email enumeration
      toast.success("Reset instructions sent", {
        description: "If an account exists with this email, you'll receive password reset instructions."
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('[Password Reset] Error:', error);
      
      // Even if there's an error, show the same success message to prevent email enumeration
      toast.success("Reset instructions sent", {
        description: "If an account exists with this email, you'll receive password reset instructions."
      });
      
      setError("If you have an account, you'll receive password reset instructions shortly.");
      return { success: false, error };
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
      
      toast.success("Password updated", {
        description: "Your password has been reset successfully. You can now log in with your new password."
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('[Password Reset] Error updating password:', error);
      
      const errorMessage = error.message || "Failed to update password. Please try again.";
      setError(errorMessage);
      
      toast.error("Password reset failed", {
        description: errorMessage
      });
      
      return { success: false, error };
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
