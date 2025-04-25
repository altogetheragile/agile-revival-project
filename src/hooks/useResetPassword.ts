
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
      
      // Create a new abort controller for this request
      const controller = new AbortController();
      setAbortController(controller);
      
      // We need both approaches to work together - the built-in Supabase method
      // and our custom edge function as fallback
      
      toast({
        title: "Processing",
        description: "Sending password reset email. This may take a moment...",
      });
      
      try {
        // 1. First try the standard Supabase auth method
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) {
          console.error('Password reset error from Supabase:', error);
          throw error;
        } else {
          console.log('Supabase reset password API succeeded');
        }
      } catch (supabaseError) {
        console.warn('Supabase auth method failed, trying edge function:', supabaseError);
        
        // 2. Fallback to our custom edge function
        try {
          const origin = window.location.origin;
          const resetLink = `${origin}/reset-password?email=${encodeURIComponent(email)}`;
          
          const edgeFunctionResponse = await supabase.functions.invoke('send-email', {
            body: {
              type: 'reset_password',
              email: email,
              recipient: email,
              template: 'reset_password',
              resetLink: resetLink
            },
            signal: controller.signal
          });
          
          if (edgeFunctionResponse.error) {
            console.error('Edge function error:', edgeFunctionResponse.error);
            throw new Error(edgeFunctionResponse.error.message || 'Error sending email via edge function');
          }
          
          console.log('Password reset via edge function response:', edgeFunctionResponse);
        } catch (edgeError) {
          if (edgeError.name === 'AbortError') {
            console.log('Reset password request was aborted');
            throw new Error('Request cancelled');
          }
          
          console.error('Edge function password reset error:', edgeError);
          throw edgeError;
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
      
      // Network timeouts often return empty objects or timeout messages
      if (error.message?.includes('timeout') || error.message === '{}') {
        toast({
          title: "Request Processing",
          description: "Your request is being processed but is taking longer than expected. Please check your email in a few minutes.",
        });
        setLocalResetEmailSent(true);
        return { success: true, timeout: true };
      }
      
      throw error;
    } finally {
      setAbortController(null);
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
