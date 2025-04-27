
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

export function ResetPasswordForm({ 
  onSubmit, 
  onSwitchToLogin, 
  loading, 
  error,
  resetEmailSent 
}: ResetPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  
  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    return handleSubmit(new Event('retry') as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    try {
      await onSubmit(email);
    } catch (error) {
      console.error('Error in ResetPasswordForm:', error);
    }
  };

  if (resetEmailSent) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          <p className="font-medium">Password reset link sent</p>
          <p className="mt-2">If an account exists with this email, you'll receive password reset instructions shortly.</p>
          <p className="mt-2 text-sm">
            Please check both your inbox and spam folders. If you don't receive an email within a few minutes:
          </p>
          <ul className="list-disc pl-5 mt-1 text-sm">
            <li>Check your spam/junk folder</li>
            <li>Verify you entered the correct email address</li>
            <li>Try requesting another reset link</li>
          </ul>
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
                  <li>If the issue persists, please contact support</li>
                </ul>
              </p>
            )}
            {(error.includes('timeout') || error.includes('busy')) && (
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
          disabled={loading}
          autoComplete="email"
        />
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        Enter your email address and we'll send you instructions to reset your password.
      </div>
      
      <div>
        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 transition-colors"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </div>
      
      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToLogin}
          disabled={loading}
          className="text-green-600 hover:text-green-700"
        >
          Back to Sign In
        </Button>
      </div>
    </form>
  );
}
