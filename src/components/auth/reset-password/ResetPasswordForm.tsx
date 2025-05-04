
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ResetPasswordAlert } from './ResetPasswordAlert';
import { ResetPasswordSuccess } from './ResetPasswordSuccess';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client'; 

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
  
  // Extended timeout for reset password requests
  const REQUEST_TIMEOUT = 30000;

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

  const handleDirectResetPassword = async () => {
    try {
      console.log(`Initiating direct password reset for: ${email}`);
      
      // Show an immediate toast to let the user know the process has started
      toast({
        title: "Processing",
        description: "Sending password reset email...",
      });
      
      // Call Supabase directly for the reset password with full options
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
        captchaToken: undefined
      });
      
      if (error) {
        console.error('Password reset error from Supabase:', error);
        throw error;
      }
      
      console.log('Password reset request successful');
      toast({
        title: "Email sent",
        description: "If an account exists with this email, you'll receive reset instructions shortly.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Password reset API error:', error);
      
      // For security, still show a success message
      toast({
        title: "Email sent",
        description: "If an account exists with this email, you'll receive reset instructions shortly.",
      });
      
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || email.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
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
        title: "Processing",
        description: "Your request is being processed but is taking longer than expected. Please check your email in a few minutes.",
        duration: 6000,
      });
      
      setLocalResetEmailSent(true);
    }, REQUEST_TIMEOUT);
    
    try {
      console.log(`Attempting password reset for ${email} (attempt ${retryCount + 1})`);
      
      // First try with direct Supabase method
      const directResult = await handleDirectResetPassword().catch(e => ({ success: false, error: e }));
      
      // Also try via the provided onSubmit callback as a backup
      try {
        await onSubmit(email);
      } catch (callbackError) {
        console.log('Note: callback onSubmit failed but direct reset might have succeeded:', callbackError);
      }
      
      clearTimeout(timeoutId);
      setRetryCount(0);
      
      setLocalResetEmailSent(true);
    } catch (error: any) {
      console.log('Error in ResetPasswordForm:', error);
      
      clearTimeout(timeoutId);
      
      // Try the callback method if the direct method fails
      if (!localResetEmailSent) {
        try {
          await onSubmit(email);
          setLocalResetEmailSent(true);
        } catch (callbackError) {
          console.log('Both reset methods failed:', callbackError);
          
          if (error.message?.includes('Network') || error.message?.includes('time') || error.message === '{}') {
            setTimeoutError("The request timed out. The server might be busy, but your request may still be processed. Please check your email or try again.");
          } else {
            setTimeoutError(error.message || "An unexpected error occurred");
          }
        }
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
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          If an account exists with this email, you'll receive password reset instructions shortly.
          <p className="mt-2">Please check your email inbox and spam folders.</p>
          <p className="mt-2 text-sm">
            Note: If you don't receive the email within a few minutes:
            <ul className="list-disc pl-5 mt-1">
              <li>Check your spam/junk folder</li>
              <li>Verify you used the correct email address</li>
              <li>Try again in a few moments if necessary</li>
            </ul>
          </p>
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onSwitchToLogin}
              className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
            >
              Back to Sign In
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {displayError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {displayError}
            {retryCount > 0 && (
              <p className="mt-2 text-sm">
                Tips to resolve:
                <ul className="list-disc pl-5 mt-1">
                  <li>Wait a few moments and try again</li>
                  <li>Check your internet connection</li>
                  <li>If the issue persists, please contact support</li>
                </ul>
              </p>
            )}
            {(displayError.includes('timeout') || displayError.includes('busy')) && (
              <Button 
                type="button" 
                onClick={handleRetry} 
                className="mt-2 bg-amber-500 hover:bg-amber-600 text-white"
                size="sm"
              >
                Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
      
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
