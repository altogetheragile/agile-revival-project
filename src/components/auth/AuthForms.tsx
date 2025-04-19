
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ResetPasswordForm from './ResetPasswordForm';
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
    }
    
    setErrorMessage(message);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);
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
      const response = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (response.error) throw response.error;
      
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

  if (mode === 'login') {
    return (
      <div className="space-y-4">
        <Button 
          onClick={handleGoogleSignIn}
          className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
          disabled={loading}
          type="button"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
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
          onSwitchToSignup={() => setMode('signup')}
          onSwitchToReset={() => {
            setMode('reset');
            setResetEmailSent(false);
          }}
          loading={loading}
          error={errorMessage}
        />
      </div>
    );
  }

  if (mode === 'signup') {
    return (
      <div className="space-y-4">
        <Button 
          onClick={handleGoogleSignIn}
          className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
          disabled={loading}
          type="button"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
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
          onSwitchToLogin={() => setMode('login')}
          loading={loading}
          error={errorMessage}
        />
      </div>
    );
  }

  return (
    <ResetPasswordForm
      onSubmit={handleResetPassword}
      onSwitchToLogin={() => setMode('login')}
      loading={loading}
      error={errorMessage}
      resetEmailSent={resetEmailSent}
    />
  );
}
