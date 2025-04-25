
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, XCircle } from "lucide-react";
import { useResetPassword } from '@/hooks/useResetPassword';
import { ResetPasswordSuccess } from './ResetPasswordSuccess';

const REQUEST_TIMEOUT = 20000;

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
  const [timeoutError, setTimeoutError] = useState<string | null>(null);
  
  const {
    isSubmitting,
    setIsSubmitting,
    error: resetError,
    setError,
    localResetEmailSent,
    setLocalResetEmailSent,
    abortController,
    setAbortController,
    handleResetPassword,
    cancelRequest
  } = useResetPassword();

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
      setLocalResetEmailSent(true);
    }, REQUEST_TIMEOUT);
    
    try {
      await handleResetPassword(email);
      clearTimeout(timeoutId);
      setRetryCount(0);
    } catch (error: any) {
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

  const isLoading = externalLoading || isSubmitting;
  const displayError = timeoutError || externalError || resetError;
  const buttonText = isLoading ? 'Processing...' : 'Send Reset Link';
  const showSuccess = resetEmailSent || localResetEmailSent;

  if (showSuccess) {
    return <ResetPasswordSuccess onSwitchToLogin={onSwitchToLogin} />;
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
              onClick={cancelRequest}
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
