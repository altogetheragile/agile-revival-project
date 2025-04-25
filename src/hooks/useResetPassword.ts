
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localResetEmailSent, setLocalResetEmailSent] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResetPassword = async (email: string) => {
    try {
      console.log(`Initiating password reset for: ${email}`);
      
      const resetLink = `${window.location.origin}/reset-password?email=${encodeURIComponent(email)}`;
      
      toast({
        title: "Processing",
        description: "Sending password reset email. This may take a moment...",
      });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Password reset error from Supabase:', error);
        
        try {
          console.log('Trying direct edge function call for password reset');
          const edgeFunctionResponse = await supabase.functions.invoke('send-email', {
            body: {
              type: 'reset_password',
              email: email,
              recipient: email,
              template: 'reset_password',
              resetLink: resetLink
            }
          });
          
          if (edgeFunctionResponse.error) {
            throw new Error(edgeFunctionResponse.error.message || 'Error sending email via edge function');
          }
          
          console.log('Password reset via edge function response:', edgeFunctionResponse);
        } catch (edgeError) {
          console.error('Edge function password reset error:', edgeError);
          throw error;
        }
      }
      
      console.log('Password reset request successful');
      toast({
        title: "Email Sent",
        description: "If an account exists with this email, you'll receive reset instructions shortly.",
      });
      
      setLocalResetEmailSent(true);
      return { success: true };
    } catch (error: any) {
      console.error('Password reset API error:', error);
      
      if (error.message?.includes('timeout') || error.message === '{}') {
        toast({
          title: "Request Processing",
          description: "Your request is being processed but is taking longer than expected. Please check your email in a few minutes.",
        });
        setLocalResetEmailSent(true);
        return { success: true, timeout: true };
      }
      
      throw error;
    }
  };

  const cancelRequest = () => {
    if (abortController) {
      abortController.abort('canceled by user');
      setError("Request canceled");
    }
    setIsSubmitting(false);
    setAbortController(null);
  };

  return {
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    localResetEmailSent,
    setLocalResetEmailSent,
    abortController,
    setAbortController,
    handleResetPassword,
    cancelRequest,
    navigate
  };
}
