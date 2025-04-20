
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ResetPasswordForm from './reset-password/ResetPasswordForm';
import GoogleSignInButton from './GoogleSignInButton';
import AuthDivider from './AuthDivider';
import { AuthMode } from './AuthContainer';

export default function AuthForms() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleError = (error: any) => {
    console.error('Authentication error:', error);
    
    let message = error.message || "An error occurred during authentication";
    
    if (error.status === 504 || error.message?.includes('timeout')) {
      message = "The server is taking too long to respond. Please try again later.";
    } else if (error.message?.includes('Failed to fetch')) {
      message = "Network error. Please check your internet connection.";
    } else if (error.message?.includes('provider is not enabled')) {
      message = "Google authentication is not properly configured. Please check your Supabase settings.";
    } else if (error.message?.includes('popup blocked')) {
      message = "Pop-up blocked. Please allow pop-ups for this website and try again.";
    } else if (error.message?.includes('already registered')) {
      message = "Email already registered. Please use another email or try logging in.";
    } else if (error.message?.includes('invalid')) {
      message = "Invalid email or password. Please check your credentials and try again.";
    }
    
    setErrorMessage(message);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      toast({
        title: "Processing",
        description: "Signing in...",
      });
      
      await signIn();
      
      // Force refresh to make sure any admin status is correctly picked up
      window.location.href = '/';
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    setErrorMessage(null);
    toast({
      title: "Processing",
      description: "Creating your account...",
    });
    
    try {
      await signUp();
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      toast({
        title: "Processing",
        description: "Sending password reset email...",
      });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setResetEmailSent(true);
      toast({
        title: "Password reset requested",
        description: "If an account exists with this email, you'll receive password reset instructions.",
      });
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    const commonProps = {
      loading,
      error: errorMessage,
    };

    if (mode === 'login') {
      return (
        <div className="space-y-4">
          <GoogleSignInButton 
            mode="login"
            loading={loading}
            onError={handleError}
          />
          <AuthDivider />
          <LoginForm
            onSubmit={handleSignIn}
            onSwitchToSignup={() => setMode('signup')}
            onSwitchToReset={() => {
              setMode('reset');
              setResetEmailSent(false);
            }}
            {...commonProps}
          />
        </div>
      );
    }

    if (mode === 'signup') {
      return (
        <div className="space-y-4">
          <GoogleSignInButton 
            mode="signup"
            loading={loading}
            onError={handleError}
          />
          <AuthDivider />
          <SignupForm
            onSubmit={handleSignUp}
            onSwitchToLogin={() => setMode('login')}
            {...commonProps}
          />
        </div>
      );
    }

    return (
      <ResetPasswordForm
        onSubmit={handleResetPassword}
        onSwitchToLogin={() => setMode('login')}
        resetEmailSent={resetEmailSent}
        {...commonProps}
      />
    );
  };

  return renderForm();
}
