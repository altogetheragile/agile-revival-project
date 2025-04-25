
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAuthError } from '@/hooks/useAuthError';
import { AuthFormProvider } from '@/contexts/AuthFormContext';
import { AuthMode } from './AuthContainer';
import LoginView from './views/LoginView';
import SignupView from './views/SignupView';
import ResetPasswordView from './views/ResetPasswordView';

export default function AuthForms() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const { errorMessage, handleError, setErrorMessage } = useAuthError();

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      toast({
        title: "Processing",
        description: "Signing in...",
      });
      
      await signIn(email, password);
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
    
    try {
      toast({
        title: "Processing",
        description: "Creating your account...",
      });
      
      await signUp(email, password, firstName, lastName);
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
      
      await resetPassword(email);
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

  const formContextValue = {
    mode,
    setMode,
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
