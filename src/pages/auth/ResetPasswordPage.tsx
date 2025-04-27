
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ResetPasswordLoading } from '@/components/auth/reset-password/ResetPasswordLoading';
import { NewPasswordForm } from '@/components/auth/reset-password/NewPasswordForm';
import { RequestResetForm } from '@/components/auth/reset-password/RequestResetForm';

export default function ResetPasswordPage() {
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [isTokenChecking, setIsTokenChecking] = useState(true);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkForToken = async () => {
      setIsTokenChecking(true);
      
      try {
        const hash = window.location.hash;
        const query = new URLSearchParams(location.search);
        const email = query.get('email');
        const token = query.get('token');
        const type = query.get('type');
        
        console.log('Token detection attempt:', { 
          hasHash: !!hash, 
          hashLength: hash?.length,
          hashContainsToken: hash?.includes('access_token='),
          hasEmail: !!email,
          hasToken: !!token,
          type: type
        });
        
        if (hash && hash.includes('access_token=')) {
          console.log('Found access_token in URL hash, confirming token...');
          
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error validating session from hash:', error);
            setTokenError('Your password reset link has expired or is invalid. Please request a new password reset.');
            setHasAccessToken(false);
          } else if (data.session) {
            console.log('Valid session detected:', data.session.expires_at);
            setHasAccessToken(true);
            setTokenError(null);
          }
        } 
        else if (token && type === 'recovery') {
          console.log('Found token and type in URL, validating recovery flow');
          
          try {
            const { data, error } = await supabase.auth.verifyOtp({
              token,
              type: 'recovery',
              email: email || undefined
            });
            
            if (error) {
              console.error('Error verifying recovery token:', error);
              setTokenError('Your password reset link has expired or is invalid. Please request a new password reset.');
              setHasAccessToken(false);
            } else if (data.session) {
              console.log('Valid recovery session established');
              setHasAccessToken(true);
              setTokenError(null);
            }
          } catch (verifyError) {
            console.error('Exception during OTP verification:', verifyError);
            setTokenError('Error verifying your reset token. Please request a new password reset.');
            setHasAccessToken(false);
          }
        }
        else if (email) {
          console.log('No token found, but email is present:', email);
          setHasAccessToken(false);
          setTokenError(null);
        } 
        else {
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

  const query = new URLSearchParams(location.search);
  const email = query.get('email');
  
  if (isTokenChecking) {
    return <ResetPasswordLoading />;
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
            {hasAccessToken ? "Enter your new password below" : "Request a new password reset link"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {hasAccessToken ? (
            <NewPasswordForm
              onSuccess={() => setSuccess(true)}
            />
          ) : email && !tokenError ? (
            <RequestResetForm email={email} />
          ) : (
            <div className="text-center p-6">
              <p className="mb-4">This reset link is either invalid or has expired.</p>
              <p className="mb-4">Please return to the login page and request a new password reset.</p>
              <Button
                type="button"
                onClick={() => navigate('/auth')}
                className="bg-green-600 hover:bg-green-700"
              >
                Go to Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
