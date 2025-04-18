
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
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="animate-in fade-in-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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
        >
          Don't have an account? Sign Up
        </Button>
        <div>
          <Button
            type="button"
            variant="link"
            onClick={onSwitchToReset}
          >
            Forgot password?
          </Button>
        </div>
      </div>
    </form>
  );
}
