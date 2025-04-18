import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { LogOut } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'reset';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, signUp, signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAuthAndRedirect = useCallback(() => {
    if (user) {
      console.log('User is authenticated, redirecting to home page', user);
      toast({
        title: "Already logged in",
        description: "You are already logged in",
      });
      navigate('/');
    }
  }, [user, navigate, toast]);

  useEffect(() => {
    console.log('Auth state changed:', { user });
    checkAuthAndRedirect();
  }, [user, checkAuthAndRedirect]);

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage(null);
      
      console.log('Starting Google sign in process...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error);
        if (error.message?.includes('provider is not enabled')) {
          throw new Error('Google authentication is not enabled. Please enable it in the Supabase dashboard under Authentication > Providers > Google.');
        }
        throw error;
      }
      
      console.log('Google sign in initiated, awaiting redirect');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      console.log('Starting email sign in process...');
      setLoading(true);
      setErrorMessage(null);
      
      await signIn(email, password);
      console.log('Sign in successful, redirecting...');
      
      toast({
        title: "Login successful",
        description: "You have been successfully logged in.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const signupResult = await Promise.race([
          signUp(email, password, firstName, lastName),
          new Promise((_, reject) => {
            controller.signal.addEventListener('abort', () => 
              reject(new Error("The request timed out. Please try again later."))
            );
          })
        ]);
        
        clearTimeout(timeoutId);
        
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
      } catch (err: any) {
        clearTimeout(timeoutId);
        
        if (err.name === 'AbortError' || err.message?.includes('timed out')) {
          throw new Error("The server is taking too long to respond. This could be due to high traffic or connectivity issues. Please try again later.");
        }
        
        throw err;
      }
    } catch (error: any) {
      console.error('Outer signup error:', error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const response = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (response.error) throw response.error;
      
      setResetEmailSent(true);
      toast({
        title: "Password reset requested",
        description: "If an account exists with this email, you'll receive password reset instructions.",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      let message = error.message || "An error occurred during the password reset";
      
      if (error.status === 504 || error.message?.includes('timeout') || error.message === '{}' || error.name === 'AbortError') {
        if (error.message?.includes('canceled by user')) {
          message = "Request canceled by user.";
        } else {
          message = "The server is taking too long to respond. This could be due to high traffic or connectivity issues. Please try again later.";
        }
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        message = "Network error. Please check your internet connection and try again.";
      }
      
      setErrorMessage(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...');
      setLoading(true);
      await signOut();
      console.log('User logged out successfully');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "There was a problem logging out.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: any) => {
    console.error('Authentication error:', error);
    
    let message = error.message || "An error occurred during authentication";
    
    if (error.status === 504 || error.message?.includes('timeout') || error.message === '{}' || error.name === 'AbortError') {
      message = "The server is taking too long to respond. This could be due to high traffic or connectivity issues. Please try again later.";
    } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      message = "Network error. Please check your internet connection and try again.";
    } else if (error.message?.includes('already registered')) {
      message = "Email already registered. Please use another email or try logging in.";
    } else if (error.message?.includes('password')) {
      message = "Invalid password. Please check your password and try again.";
    } else if (error.message?.includes('provider is not enabled')) {
      message = "Google authentication is not configured. Please contact the administrator.";
    } else if (error.message?.includes('Email not confirmed')) {
      message = "Please confirm your email address before logging in. Check your email for a confirmation link.";
    }
    
    setErrorMessage(message);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'reset': return 'Reset Password';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login': return 'Sign in to access your account';
      case 'signup': return 'Create a new account';
      case 'reset': return 'Enter your email to receive a password reset link';
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Already logged in</CardTitle>
            <CardDescription>You are already logged in</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              <LogOut className="h-4 w-4" />
              {loading ? 'Logging out...' : 'Logout'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'login' && (
            <div className="space-y-4">
              <Button 
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                disabled={loading}
                type="button"
              >
                <img 
                  src="https://www.google.com/favicon.ico" 
                  alt="Google" 
                  className="w-4 h-4"
                />
                Sign in with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <LoginForm
                onSubmit={handleSignIn}
                onSwitchToSignup={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                onSwitchToReset={() => {
                  setMode('reset');
                  setErrorMessage(null);
                  setResetEmailSent(false);
                }}
                loading={loading}
                error={errorMessage}
              />
            </div>
          )}
          
          {mode === 'signup' && (
            <div className="space-y-4">
              <Button 
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                disabled={loading}
                type="button"
              >
                <img 
                  src="https://www.google.com/favicon.ico" 
                  alt="Google" 
                  className="w-4 h-4"
                />
                Sign up with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <SignupForm
                onSubmit={handleSignUp}
                onSwitchToLogin={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                loading={loading}
                error={errorMessage}
              />
            </div>
          )}
          
          {mode === 'reset' && (
            <ResetPasswordForm
              onSubmit={handleResetPassword}
              onSwitchToLogin={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              loading={loading}
              error={errorMessage}
              resetEmailSent={resetEmailSent}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
