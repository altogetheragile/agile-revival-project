
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

type AuthMode = 'login' | 'signup' | 'reset';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (user) {
    navigate('/admin');
    return null;
  }

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      // Create an AbortController specifically for the signup page logic
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        // Use Promise.race to handle potential timeouts
        const signupResult = await Promise.race([
          signUp(email, password, firstName, lastName), // Already has its own timeout handling
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      try {
        const redirectUrl = `${window.location.origin}/reset-password`;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });
        
        clearTimeout(timeoutId);
        
        if (error) throw error;
        
        setResetEmailSent(true);
        toast({
          title: "Password reset requested",
          description: "If an account exists with this email, you'll receive password reset instructions.",
        });
      } catch (err: any) {
        clearTimeout(timeoutId);
        
        if (err.name === 'AbortError' || err.message?.includes('timeout')) {
          throw new Error("The request timed out. The system might be experiencing high traffic. Please try again in a few minutes.");
        }
        
        throw err;
      }
    } catch (error: any) {
      handleError(error);
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
      case 'login': return 'Sign in to access the admin dashboard';
      case 'signup': return 'Create a new account';
      case 'reset': return 'Enter your email to receive a password reset link';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'login' && (
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
          )}
          
          {mode === 'signup' && (
            <SignupForm
              onSubmit={handleSignUp}
              onSwitchToLogin={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              loading={loading}
              error={errorMessage}
            />
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
