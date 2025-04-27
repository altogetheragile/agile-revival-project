
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function usePasswordReset() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localResetEmailSent, setLocalResetEmailSent] = useState(false);
  const navigate = useNavigate();

  const initiatePasswordReset = async (email: string) => {
    try {
      setIsSubmitting(true);
      console.log(`Initiating password reset for: ${email}`);
      
      // Set the reset URL to the current site's reset password page
      const resetUrl = `${window.location.origin}/reset-password`;
      console.log(`Using reset URL: ${resetUrl}`);
      
      // First try the standard Supabase method
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });
      
      if (supabaseError) {
        console.error('Supabase password reset error:', supabaseError);
        
        // If Supabase direct method fails, try our custom edge function as backup
        console.log('Attempting fallback through edge function...');
        
        try {
          const { error: edgeFunctionError } = await supabase.functions.invoke('send-email', {
            body: {
              type: 'reset_password',
              email: email,
              recipient: email,
              resetLink: `${resetUrl}?email=${encodeURIComponent(email)}`
            }
          });
          
          if (edgeFunctionError) {
            console.error('Edge function error:', edgeFunctionError);
            throw edgeFunctionError;
          }
          
          console.log('Password reset email sent via edge function');
        } catch (edgeError) {
          console.error('Edge function attempt failed:', edgeError);
          // If both methods fail, throw the original error
          throw supabaseError;
        }
      }
      
      console.log('Password reset request successful');
      toast.success("If an account exists with this email, you'll receive reset instructions.");
      
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

  return {
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    localResetEmailSent,
    setLocalResetEmailSent,
    initiatePasswordReset,
    navigate
  };
}
