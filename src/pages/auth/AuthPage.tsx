
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
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
        setResetEmailSent(true);
        toast({
          title: "Password reset requested",
          description: "If an account exists with this email, you'll receive password reset instructions.",
        });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      if (error.status === 504 || error.message?.includes('timeout') || error.message === '{}') {
        setErrorMessage(
          "The server is taking too long to respond. This could be due to high traffic or connectivity issues. Please try again later."
        );
      } else {
        setErrorMessage(error.message || "An error occurred during authentication");
      }
      
      toast({
        title: "Error",
        description: errorMessage || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (!email || !email.includes('@')) {
      throw new Error("Please enter a valid email address");
    }
    
    try {
      console.log("Attempting password reset for:", email);
      
      // Set up timeout handling
      const timeoutDuration = 10000; // 10 seconds
      const resetPromise = new Promise(async (resolve, reject) => {
        try {
          const redirectUrl = `${window.location.origin}/reset-password`;
          console.log("Reset password redirect URL:", redirectUrl);
          
          const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
          });
          
          if (error) {
            console.error('Reset password error:', error);
            reject(error);
          } else {
            console.log("Password reset request sent successfully");
            resolve(data);
          }
        } catch (err) {
          reject(err);
        }
      });
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("The server is taking too long to respond. Please try again in a few moments."));
        }, timeoutDuration);
      });
      
      // Race the promises
      return await Promise.race([resetPromise, timeoutPromise]);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const renderForm = () => {
    if (mode === 'reset') {
      if (resetEmailSent) {
        return (
          <Alert className="bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              If an account exists with this email, you'll receive password reset instructions shortly.
              <p className="mt-2">Please check your email inbox and spam folders.</p>
              <p className="mt-2 text-sm">
                Note: If you don't receive the email within a few minutes:
                <ul className="list-disc pl-5 mt-1">
                  <li>Check your spam/junk folder</li>
                  <li>Verify you used the correct email address</li>
                  <li>Try again in a few moments if you encounter timeout errors</li>
                </ul>
              </p>
            </AlertDescription>
          </Alert>
        );
      }
      
      return (
        <div className="space-y-4">
          <div className="text-sm text-gray-500 mb-4">
            Enter your email address and we'll send you instructions to reset your password.
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {mode === 'signup' && (
          <>
            <div>
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full"
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
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>
      </div>
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
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            {renderForm()}
            
            <div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link'}
              </Button>
            </div>
            
            <div className="text-center space-y-2">
              {mode === 'login' && (
                <>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                    }}
                  >
                    Don't have an account? Sign Up
                  </Button>
                  <div>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        setMode('reset');
                        setErrorMessage(null);
                        setResetEmailSent(false);
                      }}
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
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                >
                  Already have an account? Sign In
                </Button>
              )}
              {mode === 'reset' && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
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
