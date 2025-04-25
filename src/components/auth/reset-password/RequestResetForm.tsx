
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuthMethods } from '@/hooks/useAuthMethods';

interface RequestResetFormProps {
  email: string;
}

export function RequestResetForm({ email }: RequestResetFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { resetPassword } = useAuthMethods();

  const handleResendResetLink = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await resetPassword(email);
      setResetEmailSent(true);
      
      toast({
        title: "Email Sent",
        description: "A new password reset link has been sent to your email. Please check your inbox and spam folders.",
        duration: 8000,
      });
    } catch (err: any) {
      console.error('Failed to send reset email:', err);
      setError(err.message || 'Failed to send reset email. Please try again later.');
      
      toast({
        title: "Error",
        description: err.message || 'Failed to send reset email',
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resetEmailSent) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          <p className="font-medium">A new password reset link has been sent to {email}.</p>
          <p className="mt-2">Please check your email inbox to complete the password reset process.</p>
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              Back to Sign In
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Alert>
        <AlertDescription>
          <p>Your reset link is invalid or has expired.</p>
          <p className="mt-2">We can send a new password reset link to: <strong>{email}</strong></p>
        </AlertDescription>
      </Alert>
      
      <div className="flex space-x-2">
        <Button
          onClick={handleResendResetLink}
          disabled={isSubmitting}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send New Reset Link'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/auth')}
          className="flex-1"
        >
          Back to Sign In
        </Button>
      </div>
    </div>
  );
}
