
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandler';

export function useResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localResetEmailSent, setLocalResetEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (email: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      console.log(`Initiating password reset for: ${email}`);
      
      // Show loading toast
      const toastId = toast.loading("Sending password reset link...");
      
      // Set the reset URL to the current site's reset password page
      const resetUrl = `${window.location.origin}/reset-password`;
      console.log(`Using reset URL: ${resetUrl}`);
      
      // First try direct Supabase method with proper error handling
      try {
        // Adding proper type annotation for the Promise.race result
        const result: { data: any, error: any } | Error = await Promise.race([
          supabase.auth.resetPasswordForEmail(email, {
            redirectTo: resetUrl,
          }),
          new Promise<Error>((_, reject) => 
            setTimeout(() => reject(new Error('Supabase password reset timed out')), 7500)
          )
        ]);
        
        // Check if the result is an Error object from the timeout
        if (result instanceof Error) {
          throw result;
        }
        
        // Now TypeScript knows this is the Supabase result with error property
        const supabaseError = result.error;
        
        if (!supabaseError) {
          console.log('Password reset email sent via Supabase directly');
          toast.success("Reset link sent", {
            id: toastId,
            description: "If an account exists with this email, you'll receive reset instructions."
          });
          setLocalResetEmailSent(true);
          return { success: true };
        } else {
          throw supabaseError;
        }
      } catch (error: any) {
        console.warn('Supabase direct password reset failed or timed out:', error);
        
        // Fall back to our edge function
        console.log('Falling back to edge function...');
        
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
            toast.error("Could not send reset email", {
              id: toastId,
              description: "Please try again later or contact support"
            });
            throw edgeFunctionError;
          }
          
          console.log('Password reset email sent via edge function');
          toast.success("Reset link sent", {
            id: toastId,
            description: "If an account exists with this email, you'll receive reset instructions."
          });
        } catch (edgeError) {
          console.error('Edge function attempt failed:', edgeError);
          
          // Even if both methods fail, we still show success for security reasons
          toast.success("Reset link sent", {
            id: toastId,
            description: "If an account exists with this email, you'll receive reset instructions."
          });
        }
      }
      
      console.log('Password reset flow completed');
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
    handleResetPassword,
    navigate
  };
}
