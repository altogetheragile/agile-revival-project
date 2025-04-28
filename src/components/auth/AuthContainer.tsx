
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { ResetPasswordForm } from '@/components/auth/reset-password/ResetPasswordForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

export type AuthMode = 'login' | 'signup' | 'reset';

export default function AuthContainer() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const from = (location.state as { from?: string })?.from || "/";

  useEffect(() => {
    if (user) {
      if (isAdmin && from.includes('/admin')) {
        navigate('/admin');
        return;
      }
      
      navigate(from);
    }
  }, [user, isAdmin, navigate, from]);

  // Clear errors when changing tabs and reset the resetEmailSent state when leaving the reset tab
  const handleTabChange = (value: AuthMode) => {
    setError(null);
    
    if (authMode === 'reset' && value !== 'reset') {
      setResetEmailSent(false);
    }
    
    setAuthMode(value);
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp(email, password, firstName, lastName);
      toast({
        title: "Account created",
        description: "Please sign in with your new account",
      });
      setAuthMode('login');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Using direct Supabase method to reset password
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/reset-password` }
      );
      
      if (error) throw error;
      
      setResetEmailSent(true);
      toast({
        title: "Reset email sent",
        description: "If an account exists with this email, you'll receive reset instructions shortly.",
      });
    } catch (err: any) {
      // Don't expose specific errors for security reasons
      console.error('Password reset error:', err);
      
      // Still show success message for security (don't reveal if email exists)
      setResetEmailSent(true);
      toast({
        title: "Reset email sent",
        description: "If an account exists with this email, you'll receive reset instructions.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-agile-purple/10">
              <Shield className="h-6 w-6 text-agile-purple" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Welcome</CardTitle>
          <CardDescription className="text-center">
            {authMode === 'login' ? "Sign in to access your account" :
             authMode === 'signup' ? "Create an account to get started" :
             "Reset your password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={authMode} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
              <TabsTrigger value="reset">Reset</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="pt-4">
              <LoginForm 
                onSubmit={handleLogin}
                onSwitchToSignup={() => handleTabChange('signup')}
                onSwitchToReset={() => handleTabChange('reset')}
                loading={isLoading}
                error={error}
              />
            </TabsContent>
            <TabsContent value="signup" className="pt-4">
              <SignupForm
                onSubmit={handleSignup}
                onSwitchToLogin={() => handleTabChange('login')}
                loading={isLoading}
                error={error}
              />
            </TabsContent>
            <TabsContent value="reset" className="pt-4">
              <ResetPasswordForm 
                onSubmit={handleResetPassword}
                onSwitchToLogin={() => handleTabChange('login')}
                loading={isLoading}
                error={error}
                resetEmailSent={resetEmailSent}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
