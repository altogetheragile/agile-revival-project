
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  onSwitchToReset: () => void;
  loading: boolean;
  error: string | null;
}

export default function LoginForm({ 
  onSubmit, 
  onSwitchToSignup, 
  onSwitchToReset, 
  loading, 
  error 
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted with:", { email });
    try {
      await onSubmit(email.trim(), password); // Trim whitespace from email
    } catch (error) {
      console.error("Login form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="animate-in fade-in-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <p className="mt-2 text-sm">
              If you continue experiencing issues:
              <ul className="list-disc pl-5 mt-1">
                <li>Check your internet connection</li>
                <li>Verify your email and password are correct</li>
                <li>Try again in a few moments if there are server issues</li>
              </ul>
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      <div>
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
          disabled={loading}
          autoComplete="email"
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
          disabled={loading}
          autoComplete="current-password"
        />
      </div>
      
      <div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </div>
      
      <div className="text-center space-y-2">
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToSignup}
          className="text-green-600 hover:text-green-700"
          disabled={loading}
        >
          Don't have an account? Sign Up
        </Button>
        <div>
          <Button
            type="button"
            variant="link"
            onClick={onSwitchToReset}
            disabled={loading}
          >
            Forgot password?
          </Button>
        </div>
      </div>
    </form>
  );
}
