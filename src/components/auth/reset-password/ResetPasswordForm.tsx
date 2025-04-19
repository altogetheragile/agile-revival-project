
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ResetPasswordAlert } from './ResetPasswordAlert';
import { ResetPasswordActions } from './ResetPasswordActions';

interface ResetPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onSwitchToLogin: () => void;
  loading: boolean;
  error: string | null;
  resetEmailSent: boolean;
}

export default function ResetPasswordForm({ 
  onSwitchToLogin, 
  loading: externalLoading, 
  error: externalError,
  resetEmailSent 
}: ResetPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeoutError, setTimeoutError] = useState<string | null>(null);
  const [localResetEmailSent, setLocalResetEmailSent] = useState(resetEmailSent);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const { toast } = useToast();
  
  const REQUEST_TIMEOUT = 20000;

  useEffect(() => {
    if (timeoutError) {
      setTimeoutError(null);
    }
  }, [email]);
  
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const handleResetPassword = async () => {
    try {
      console.log(`Initiating password reset for: ${email}`);
      
      toast({
        title: "Processing",
        description: "Sending password reset email. This may take a moment...",
      });
      
      // First try the standard Supabase method
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Password reset error from Supabase:', error);
        
        // If Supabase fails, try our custom edge function as backup
        try {
          console.log('Trying direct edge function call for password reset');
          const edgeFunctionResponse = await supabase.functions.invoke('send-email', {
            body: {
              type: 'reset_password',
              email: email,
              recipient: email,
              template: 'reset_password'
            }
          });
          
          if (edgeFunctionResponse.error) {
            throw new Error(edgeFunctionResponse.error.message || 'Error sending email via edge function');
          }
          
          console.log('Password reset via edge function response:', edgeFunctionResponse);
        } catch (edgeError) {
          console.error('Edge function password reset error:', edgeError);
          // If both methods fail, throw the original error
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

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    return handleSubmit(new Event('retry') as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || externalLoading) return;
    
    setIsSubmitting(true);
    setTimeoutError(null);
    
    const controller = new AbortController();
    setAbortController(controller);
    
    const timeoutId = setTimeout(() => {
      controller.abort('timeout');
      setTimeoutError("Request timed out. The server might be busy but your request may still be processed. Please check your email in a few minutes.");
      setIsSubmitting(false);
      
      toast({
        title: "Request Processing",
        description: "Your request is being processed but is taking longer than expected. Please check your email in a few minutes.",
        duration: 6000,
      });
      
      setLocalResetEmailSent(true);
    }, REQUEST_TIMEOUT);
    
    try {
      console.log(`Attempting password reset for ${email} (attempt ${retryCount + 1})`);
      await handleResetPassword();
      
      clearTimeout(timeoutId);
      setRetryCount(0);
      setLocalResetEmailSent(true);
    } catch (error: any) {
      console.log('Error in ResetPasswordForm:', error);
      
      clearTimeout(timeoutId);
      
      if (error.message?.includes('Network') || error.message?.includes('time') || error.message === '{}') {
        setTimeoutError("The request timed out. The server might be busy, but your request may still be processed. Please check your email or try again.");
      } else {
        setTimeoutError(error.message || "An unexpected error occurred");
      }
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
      setAbortController(null);
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort('canceled by user');
      setTimeoutError("Request canceled");
    }
    setIsSubmitting(false);
    setAbortController(null);
  };

  const isLoading = externalLoading || isSubmitting;
  const displayError = timeoutError || externalError;
  const buttonText = isLoading ? 'Processing...' : 'Send Reset Link';
  const showSuccess = resetEmailSent || localResetEmailSent;

  if (showSuccess) {
    return (
      <ResetPasswordAlert 
        success={true}
        onSwitchToLogin={onSwitchToLogin}
        retryCount={retryCount}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ResetPasswordAlert 
        error={displayError}
        retryCount={retryCount}
        onRetry={handleRetry}
        onSwitchToLogin={onSwitchToLogin}
      />
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
          disabled={isLoading}
          autoComplete="email"
        />
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        Enter your email address and we'll send you instructions to reset your password.
      </div>
      
      <ResetPasswordActions 
        isLoading={isLoading}
        onCancel={handleCancel}
        buttonText={buttonText}
      />
      
      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToLogin}
          disabled={isLoading}
          className="text-green-600 hover:text-green-700"
        >
          Back to Sign In
        </Button>
      </div>
    </form>
  );
}
