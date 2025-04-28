
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAuthError } from '@/hooks/useAuthError';
import { AuthFormProvider } from '@/contexts/AuthFormContext';
import { AuthMode } from './AuthContainer';
import LoginView from './views/LoginView';
import SignupView from './views/SignupView';
import ResetPasswordView from './views/ResetPasswordView';
import { supabase } from '@/integrations/supabase/client';

export default function AuthForms() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { signIn, signUp } = useAuth();
  const { errorMessage, handleError, setErrorMessage } = useAuthError();
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      toast({
        title: "Signing in...",
        description: "Please wait"
      });
      
      await signIn(email, password);
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
      toast({
        title: "Creating account...",
        description: "Please wait"
      });
      
      // Make sure we have a password
      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      await signUp(email, password, firstName, lastName);
      toast({
        title: "Success",
        description: "Registration successful. Please check your email to verify your account."
      });
      
      // Switch to login mode after successful signup
      setMode('login');
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string): Promise<void> => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      toast({
        title: "Processing",
        description: "Sending password reset email..."
      });
      
      // Use direct Supabase method for password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      setResetEmailSent(true);
      toast({
        title: "Email sent",
        description: "If an account exists with this email, you'll receive reset instructions."
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      
      // For security, we still show success even on error
      setResetEmailSent(true);
      toast({
        title: "Email sent",
        description: "If an account exists with this email, you'll receive reset instructions."
      });
      
      // Store the error but don't show it to user
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle mode change (clear errors when changing modes)
  const handleModeChange = (newMode: AuthMode) => {
    setErrorMessage(null);
    if (mode === 'reset' && newMode !== 'reset') {
      setResetEmailSent(false);
    }
    setMode(newMode);
  };

  const formContextValue = {
    mode,
    setMode: handleModeChange,
    loading,
    setLoading
  };

  return (
    <AuthFormProvider value={formContextValue}>
      {mode === 'login' && (
        <LoginView
          onSubmit={handleSignIn}
          error={errorMessage}
        />
      )}
      {mode === 'signup' && (
        <SignupView
          onSubmit={handleSignUp}
          error={errorMessage}
        />
      )}
      {mode === 'reset' && (
        <ResetPasswordView
          onSubmit={handleResetPassword}
          error={errorMessage}
          resetEmailSent={resetEmailSent}
        />
      )}
    </AuthFormProvider>
  );
}
