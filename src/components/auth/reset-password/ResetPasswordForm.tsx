
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
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
  onSubmit, 
  onSwitchToLogin, 
  loading: externalLoading, 
  error: externalError,
  resetEmailSent 
}: ResetPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localResetEmailSent, setLocalResetEmailSent] = useState(resetEmailSent);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || externalLoading) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(email);
      
      setLocalResetEmailSent(true);
      toast({
        title: "Email Sent",
        description: "If an account exists with this email, you'll receive reset instructions shortly.",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Customize error message based on the error
      let errorMessage = error.message || 'Failed to send reset email';
      
      if (errorMessage.includes("User not found")) {
        // Don't expose whether a user exists or not for security
        errorMessage = "If an account exists with this email, you'll receive reset instructions shortly.";
        
        // Still mark as sent for security reasons (don't reveal if account exists)
        setLocalResetEmailSent(true);
        
        toast({
          title: "Email Sent",
          description: errorMessage
        });
      } else {
        setError(errorMessage);
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = externalLoading || isSubmitting;
  const displayError = error || externalError;
  const showSuccess = resetEmailSent || localResetEmailSent;

  if (showSuccess) {
    return (
      <ResetPasswordAlert 
        success={true}
        onSwitchToLogin={onSwitchToLogin}
        retryCount={0}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ResetPasswordAlert 
        error={displayError}
        retryCount={0}
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
        buttonText="Send Reset Link"
        loadingText="Sending Email..."
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
