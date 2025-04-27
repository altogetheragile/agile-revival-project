import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ResetPasswordAlert } from './ResetPasswordAlert';
import { ResetPasswordSuccess } from './ResetPasswordSuccess';
import { useToast } from '@/hooks/use-toast';

interface ResetPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onSwitchToLogin: () => void;
  loading: boolean;
  error: string | null;
  resetEmailSent: boolean;
}

export function ResetPasswordForm({ 
  onSubmit, 
  onSwitchToLogin, 
  loading: externalLoading, 
  error: externalError,
  resetEmailSent: externalResetEmailSent
}: ResetPasswordFormProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeoutError, setTimeoutError] = useState<string | null>(null);
  const [localResetEmailSent, setLocalResetEmailSent] = useState(externalResetEmailSent);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  
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

  useEffect(() => {
    if (externalResetEmailSent !== localResetEmailSent) {
      setLocalResetEmailSent(externalResetEmailSent);
    }
  }, [externalResetEmailSent]);

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
        description: "Your request is being processed but is taking longer than expected. Please check your email in a few minutes.",
        duration: 6000,
      });
      
      setLocalResetEmailSent(true);
    }, REQUEST_TIMEOUT);
    
    try {
      console.log(`Attempting password reset for ${email} (attempt ${retryCount + 1})`);
      await onSubmit(email);
      
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
  
  const showSuccess = externalResetEmailSent || localResetEmailSent;

  if (showSuccess) {
    return <ResetPasswordSuccess onSwitchToLogin={onSwitchToLogin} />;
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
      
      <div>
        {isLoading ? (
          <div className="flex space-x-2">
            <Button 
              type="button" 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handleCancel}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="button" 
              className="w-full"
              disabled={true}
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {buttonText}
            </Button>
          </div>
        ) : (
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 transition-colors"
          >
            {buttonText}
          </Button>
        )}
      </div>
      
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
