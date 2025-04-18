
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ResetPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onSwitchToLogin: () => void;
  loading: boolean;
  error: string | null;
  resetEmailSent: boolean;
}

export default function ResetPasswordForm({ 
  onSubmit, 
  onSwitchToLogin, 
  loading, 
  error,
  resetEmailSent 
}: ResetPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(email);
      // Reset retry count on successful submission
      setRetryCount(0);
    } catch (error) {
      // Increment retry count
      setRetryCount(prev => prev + 1);
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;
  const buttonText = isLoading ? 'Processing...' : 'Send Reset Link';

  if (resetEmailSent) {
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
              <li>Try again in a few moments if you encounter timeout errors</li>
            </ul>
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            {retryCount > 0 && (
              <p className="mt-2 text-sm">
                Tips to resolve:
                <ul className="list-disc pl-5 mt-1">
                  <li>Wait a few moments and try again</li>
                  <li>Check your internet connection</li>
                  <li>Try using a different browser</li>
                  <li>If the issue persists, please contact support</li>
                </ul>
              </p>
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
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText}
        </Button>
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
