
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { useAuthMethods } from '@/hooks/useAuthMethods';

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
  const { resetPassword } = useAuthMethods();
  
  // Maximum timeout increased to 20 seconds for better chances of success
  const REQUEST_TIMEOUT = 20000;

  // Clear timeout error when email changes
  useEffect(() => {
    if (timeoutError) {
      setTimeoutError(null);
    }
  }, [email]);
  
  // Cleanup function for any pending requests
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
      
      // Generate a reset link for the email
      const resetLink = `${window.location.origin}/reset-password?email=${encodeURIComponent(email)}`;
      
      // Show an immediate toast to let the user know the process has started
      toast({
        title: "Processing",
        description: "Sending password reset email. This may take a moment...",
      });
      
      // Call the resetPassword function
      await resetPassword(email);
      
      console.log('Password reset request successful');
      toast({
        title: "Email Sent",
        description: "If an account exists with this email, you'll receive reset instructions shortly.",
      });
      
      setLocalResetEmailSent(true);
      return { success: true };
    } catch (error: any) {
      console.error('Password reset API error:', error);
      
      // Special case for timeout errors
      if (error.message?.includes('timeout') || error.message === '{}') {
        toast({
          title: "Request Processing",
          description: "Your request is being processed but is taking longer than expected. Please check your email in a few minutes.",
        });
        // We'll consider this a success even though it timed out
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
    
    // Create a new abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);
    
    // Set a timeout to abort the request after specified timeout
    const timeoutId = setTimeout(() => {
      controller.abort('timeout');
      setTimeoutError("Request timed out. The server might be busy but your request may still be processed. Please check your email in a few minutes.");
      setIsSubmitting(false);
      
      // Even though it timed out, we'll show a toast suggesting to check email
      toast({
        title: "Request Processing",
        description: "Your request is being processed but is taking longer than expected. Please check your email in a few minutes.",
        duration: 6000,
      });
      
      // Assume it might have worked despite the timeout
      setLocalResetEmailSent(true);
    }, REQUEST_TIMEOUT);
    
    try {
      console.log(`Attempting password reset for ${email} (attempt ${retryCount + 1})`);
      await handleResetPassword();
      
      clearTimeout(timeoutId);
      setRetryCount(0);
      
      // Show success even if the parent component hasn't updated
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

  // Allow user to cancel a pending request
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
  
  // Use either the prop value or local state
  const showSuccess = resetEmailSent || localResetEmailSent;

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
