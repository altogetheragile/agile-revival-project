import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useAuthError } from '@/hooks/useAuthError';
import { AuthFormProvider } from '@/contexts/AuthFormContext';
import { AuthMode } from './AuthContainer';
import LoginView from './views/LoginView';
import SignupView from './views/SignupView';
import ResetPasswordView from './views/ResetPasswordView';
import { usePasswordReset } from '@/hooks/usePasswordReset';

export default function AuthForms() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { signIn, signUp } = useAuth();
  const { errorMessage, handleError, setErrorMessage } = useAuthError();

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      toast.loading("Signing in...");
      
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
      toast.loading("Creating your account...");
      
      await signUp(email, password, firstName, lastName);
      toast.success("Registration successful", {
        description: "Please check your email to verify your account."
      });
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
      toast.loading("Sending reset link...");
      const { initiatePasswordReset } = usePasswordReset();
      const result = await initiatePasswordReset(email);
      
      if (!result.success && result.error) {
        throw result.error;
      }
      
      setResetEmailSent(true);
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
