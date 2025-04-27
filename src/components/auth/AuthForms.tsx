
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
import { supabase } from '@/integrations/supabase/client';

export default function AuthForms() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { signIn, signUp } = useAuth();
  const { errorMessage, handleError, setErrorMessage } = useAuthError();
  const { initiatePasswordReset } = usePasswordReset();

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

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      console.log('Attempting password reset for:', email);
      toast.loading("Sending reset link...");
      
      // First try the standard Supabase method
      const resetUrl = `${window.location.origin}/reset-password`;
      console.log('Using reset URL:', resetUrl);
      
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl
      });
      
      if (supabaseError) {
        console.error('Supabase reset password error:', supabaseError);
        console.log('Attempting fallback through edge function...');
        
        // If Supabase direct method fails, try our custom edge function as backup
        const { error: edgeFunctionError } = await supabase.functions.invoke('send-email', {
          body: {
            type: 'reset_password',
            email: email,
            recipient: email,
            resetLink: `${resetUrl}?email=${encodeURIComponent(email)}`
          }
        });
        
        if (edgeFunctionError) {
          console.error('Edge function error:', edgeFunctionError);
          throw new Error(`Failed to send password reset email: ${edgeFunctionError.message}`);
        }
        
        console.log('Password reset initiated through edge function');
      } else {
        console.log('Password reset initiated through Supabase');
      }
      
      toast.success("Reset link sent", {
        description: "If an account exists with this email, you'll receive reset instructions."
      });
      setResetEmailSent(true);
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Show error to user but still set the UI as if email was sent
      toast.error("Error sending reset email", {
        description: "Please try again in a few moments or contact support."
      });
      
      // Still show successful UI state for security reasons
      setResetEmailSent(true);
      handleError(error);
      
      return { success: false, error };
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
