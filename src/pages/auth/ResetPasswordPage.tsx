import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Loader2, Shield } from 'lucide-react';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { supabase } from '@/integrations/supabase/client';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [isTokenChecking, setIsTokenChecking] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updatePassword } = useAuthMethods();

  useEffect(() => {
    // This function checks if the URL contains a valid access token
    const checkForToken = async () => {
      setIsTokenChecking(true);
      
      try {
        // Get both hash and query parameters
        const hash = window.location.hash;
        const query = new URLSearchParams(location.search);
        const email = query.get('email');
        
        // Log token detection attempt
        console.log('Token detection attempt:', { 
          hasHash: !!hash, 
          hashLength: hash?.length,
          hashContainsToken: hash?.includes('access_token='),
          hasEmail: !!email
        });
        
        if (hash && hash.includes('access_token=')) {
          console.log('Found access_token in URL hash, confirming token...');
          setHasAccessToken(true);
          setTokenError(null);
          
          // The Supabase client will automatically process this token
          // But we can try to validate it too
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error validating session from hash:', error);
            setTokenError('Your password reset link has expired or is invalid. Please request a new password reset.');
            setHasAccessToken(false);
          } else if (data.session) {
            console.log('Valid session detected:', data.session.expires_at);
          }
        } else if (email) {
          // If we only have email, this is likely a custom reset request
          console.log('No token found, but email is present:', email);
          setHasAccessToken(false);
          setTokenError(null);
        } else {
          console.log('Neither token nor email found in URL');
          setTokenError('Invalid or missing reset password token. Please request a new password reset.');
          setHasAccessToken(false);
        }
      } catch (err: any) {
        console.error('Error during token detection:', err);
        setTokenError('Error processing reset token. Please request a new password reset.');
        setHasAccessToken(false);
      } finally {
        setIsTokenChecking(false);
      }
    };
    
    checkForToken();
  }, [location]);

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting to update password with hasAccessToken:', hasAccessToken);
      
      await updatePassword(newPassword);
      
      setSuccess(true);
      toast({
        title: "Password updated",
        description: "Your password has been successfully reset",
      });
      
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      
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

  const query = new URLSearchParams(location.search);
  const email = query.get('email');
  
  // If we have email but no access token, show the request form
  if (email && !hasAccessToken && !isTokenChecking) {
    return <RequestPasswordResetForm email={email} />;
  }

  // If we're still checking for token, show loading state
  if (isTokenChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-agile-purple/10">
                <Loader2 className="h-6 w-6 text-agile-purple animate-spin" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Verifying Reset Link</CardTitle>
            <CardDescription className="text-center">
              Please wait while we verify your password reset link...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
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
      
      const result = await resetPassword(email);
      
      console.log('Reset password result:', result);
      setResetEmailSent(true);
      
      toast({
        title: "Email Sent",
        description: "A new password reset link has been sent to your email. Please check your inbox and spam folders.",
        duration: 8000,
      });
    } catch (err: any) {
      console.error('Failed to send reset email:', err);
      
      let errorMessage = 'Failed to send reset email. Please try again later.';
      
      if (err.message?.includes('timeout') || err.message?.includes('network')) {
        errorMessage = 'The request timed out. Please try again in a moment.';
      } else if (err.message?.includes('rate limit') || err.message?.includes('too many requests')) {
        errorMessage = 'Too many attempts. Please wait a few minutes before trying again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
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
                <p className="font-medium">A new password reset link has been sent to {email}.</p>
                <p className="mt-2">Please check your email inbox to complete the password reset process.</p>
                <p className="mt-2 text-sm">
                  <strong>Important:</strong> The link in the email will expire in 24 hours. If you don't see the email:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Check your spam/junk folder</li>
                    <li>Make sure {email} is the correct email address</li>
                    <li>Try resending the link if needed</li>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
