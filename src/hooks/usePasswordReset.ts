
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
      
      // Try direct Supabase method first with timeout handling
      let supabaseError;
      try {
        const result = await Promise.race([
          supabase.auth.resetPasswordForEmail(email, {
            redirectTo: resetUrl,
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Supabase password reset timed out')), 5000)
          )
        ]);
        
        supabaseError = result.error;
        
        if (!supabaseError) {
          console.log('Password reset email sent via Supabase directly');
        }
      } catch (timeoutErr) {
        console.warn('Supabase direct password reset timed out, falling back to edge function');
        supabaseError = new Error('Request timed out');
      }
      
      // If Supabase direct method fails, try our custom edge function as backup
      if (supabaseError) {
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
            
            // Update loading toast to error
            toast.error("Could not send reset email", {
              id: toastId,
              description: "Please try again later or contact support"
            });
            
            throw edgeFunctionError;
          }
          
          console.log('Password reset email sent via edge function');
          
          // Update loading toast to success
          toast.success("Reset link sent", {
            id: toastId,
            description: "If an account exists with this email, you'll receive reset instructions."
          });
        } catch (edgeError) {
          console.error('Edge function attempt failed:', edgeError);
          
          // Update loading toast to error
          toast.error("Could not send reset email", {
            id: toastId,
            description: "Please try again later or contact support"
          });
          
          // If both methods fail, throw the original error
          throw supabaseError;
        }
      } else {
        // Update loading toast to success
        toast.success("Reset link sent", {
          id: toastId,
          description: "If an account exists with this email, you'll receive reset instructions."
        });
      }
      
      console.log('Password reset request successful');
      
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
