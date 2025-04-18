
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await signIn(email, password);
        navigate('/admin');
      } else if (mode === 'signup') {
        await signUp(email, password, firstName, lastName);
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
      } else if (mode === 'reset') {
        await resetPassword(email);
        toast({
          title: "Password reset email sent",
          description: "Please check your email for password reset instructions.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    if (error) throw error;
  };

  const renderForm = () => {
    if (mode === 'reset') {
      return (
        <div>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      );
    }

    return (
      <>
        {mode === 'signup' && (
          <>
            <div>
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}</CardTitle>
          <CardDescription>
            {mode === 'login' 
              ? 'Sign in to access the admin dashboard' 
              : mode === 'signup'
                ? 'Create a new account'
                : 'Enter your email to receive a password reset link'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderForm()}
            <div>
              <Button type="submit" className="w-full">
                {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link'}
              </Button>
            </div>
            <div className="text-center space-y-2">
              {mode === 'login' && (
                <>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode('signup')}
                  >
                    Don't have an account? Sign Up
                  </Button>
                  <div>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setMode('reset')}
                    >
                      Forgot password?
                    </Button>
                  </div>
                </>
              )}
              {mode === 'signup' && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode('login')}
                >
                  Already have an account? Sign In
                </Button>
              )}
              {mode === 'reset' && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode('login')}
                >
                  Back to Sign In
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
