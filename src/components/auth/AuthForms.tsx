
import React, { useState } from 'react';
import { AuthFormProvider } from '@/contexts/AuthFormContext';
import LoginView from './views/LoginView';
import SignupView from './views/SignupView';
import ResetPasswordView from './views/ResetPasswordView';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthError } from '@/hooks/useAuthError';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'signup' | 'reset';

const AuthForms = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { errorMessage, handleError, setErrorMessage } = useAuthError();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await signIn(email, password);
      toast.success("Login successful");
      // Add navigation to redirect after successful login
      navigate('/');
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await signUp(email, password, firstName, lastName);
      toast.success("Account created! Please check your email to confirm your account.");
      setMode('login');
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await resetPassword(email);
      toast.success("Password reset email sent", {
        description: "Please check your inbox for instructions"
      });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    mode,
    setMode,
    loading,
    setLoading
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
      <AuthFormProvider value={contextValue}>
        {mode === 'login' && (
          <LoginView 
            onSubmit={handleLogin} 
            error={errorMessage} 
          />
        )}
        {mode === 'signup' && (
          <SignupView 
            onSubmit={handleSignup} 
            error={errorMessage} 
          />
        )}
        {mode === 'reset' && (
          <ResetPasswordView 
            onSubmit={handleResetPassword} 
            error={errorMessage} 
          />
        )}
      </AuthFormProvider>
    </div>
  );
};

export default AuthForms;
