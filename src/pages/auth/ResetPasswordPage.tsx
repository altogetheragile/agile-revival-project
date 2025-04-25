
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, Loader2, Shield } from 'lucide-react';
import { useAuthMethods } from '@/hooks/useAuthMethods';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updatePassword } = useAuthMethods();

  // Get access token from URL parameters
  useEffect(() => {
    const hash = window.location.hash;
    const query = new URLSearchParams(location.search);
    const email = query.get('email');
    
    // Check if we have an access token or hash fragment
    if (hash && hash.includes('access_token=')) {
      setHasAccessToken(true);
      setTokenError(null);
    } else if (!email) {
      // If there's no access token in the URL, and no email (for the request form)
      // then there's something wrong
      setTokenError('Invalid or missing reset password token. Please request a new password reset.');
    } else {
      setTokenError(null);
    }

    console.log('URL hash:', hash);
    console.log('Has access token:', hash && hash.includes('access_token='));
    console.log('Email in URL:', email);
  }, [location]);

  // Form validation
  const validateForm = () => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    setError(null);
    return true;
  };

  // Handle password reset submission
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting to update password with hasAccessToken:', hasAccessToken);
      
      // Attempt to update the password
      await updatePassword(newPassword);
      
      setSuccess(true);
      toast({
        title: "Password updated",
        description: "Your password has been successfully reset",
      });
      
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      
      // Handle specific error cases with more user-friendly messages
      if (error.message?.includes('invalid') || error.message?.includes('expired')) {
        setError('Your password reset link has expired or is invalid. Please request a new password reset.');
      } else if (error.message?.includes('session')) {
        setError('No active session found. Please request a new password reset link.');
      } else {
        setError(error.message || 'Failed to reset password. Please try again.');
      }
      
      toast({
        title: "Error",
        description: error.message || 'Failed to reset password',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // If we only have an email query parameter and no token, show the reset request form
  const query = new URLSearchParams(location.search);
  const email = query.get('email');
  
  if (email && !hasAccessToken) {
    return <RequestPasswordResetForm email={email} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-agile-purple/10">
              <Shield className="h-6 w-6 text-agile-purple" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {tokenError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {tokenError}
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/auth')}
                    className="mt-2"
                  >
                    Go to Sign In
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : success ? (
            <Alert className="bg-green-50 border-green-200 mb-4">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Your password has been successfully reset. You will be redirected to the login page in a moment.
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/auth')}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    Go to Sign In
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your new password"
                  className="w-full"
                  autoComplete="new-password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Confirm your new password"
                  className="w-full"
                  autoComplete="new-password"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
              
              <div className="text-center mt-4">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/auth')}
                  className="text-green-600"
                >
                  Back to Sign In
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Component to handle cases where we only have an email but no token
function RequestPasswordResetForm({ email }: { email: string }) {
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
      console.log('Attempting to resend password reset link to:', email);
      
      // Use enhanced resetPassword from useAuthMethods
      await resetPassword(email);
      
      setResetEmailSent(true);
      toast({
        title: "Email Sent",
        description: "A new password reset link has been sent to your email",
      });
    } catch (err: any) {
      console.error('Failed to send reset email:', err);
      
      // Provide user-friendly error message
      if (err.message?.includes('timeout') || err.message?.includes('network')) {
        setError('The request timed out. Please try again in a moment.');
      } else if (err.message?.includes('rate limit') || err.message?.includes('too many requests')) {
        setError('Too many attempts. Please wait a few minutes before trying again.');
      } else {
        setError(err.message || 'Failed to send reset email. Please try again later.');
      }
      
      toast({
        title: "Error",
        description: err.message || 'Failed to send reset email',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-agile-purple/10">
              <Shield className="h-6 w-6 text-agile-purple" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Request a new password reset link
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {resetEmailSent ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                A new password reset link has been sent to {email}. Please check your email inbox.
                <p className="mt-2 text-sm">
                  Note: If you don't receive the email within a few minutes:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Check your spam/junk folder</li>
                    <li>Verify you used the correct email address</li>
                  </ul>
                </p>
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
          ) : (
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
                  <p className="mt-2">We can send a new password reset link to <strong>{email}</strong></p>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
