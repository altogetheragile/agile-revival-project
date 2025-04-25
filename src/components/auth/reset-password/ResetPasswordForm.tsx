
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { useResetPassword } from '@/hooks/useResetPassword';
import { ResetPasswordSuccess } from './ResetPasswordSuccess';
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
  const [timeoutError, setTimeoutError] = useState<string | null>(null);
  const {
    isSubmitting,
    setIsSubmitting,
    error: resetError,
    localResetEmailSent,
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
    
    try {
      await handleResetPassword(email);
      setRetryCount(0);
    } catch (error: any) {
      if (error.message?.includes('Network') || error.message?.includes('time') || error.message === '{}') {
        setTimeoutError("The request timed out. The server might be busy, but your request may still be processed. Please check your email or try again.");
      } else {
        setTimeoutError(error.message || "An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
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
