
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

interface SignupFormProps {
  onSubmit: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  onSwitchToLogin: () => void;
  loading: boolean;
  error: string | null;
}

export default function SignupForm({ 
  onSubmit, 
  onSwitchToLogin, 
  loading, 
  error 
}: SignupFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || loading) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(
        formData.email.trim(), // Trim whitespace
        formData.password,
        formData.firstName.trim(), // Trim whitespace
        formData.lastName.trim() // Trim whitespace
      );
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;
  const buttonText = isLoading ? 'Creating Account...' : 'Sign Up';

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
                <li>Try again in a few moments</li>
                <li>Verify your email address is correct</li>
                <li>Use a password with at least 6 characters</li>
              </ul>
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          required
          autoComplete="given-name"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          required
          autoComplete="family-name"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          minLength={6}
          disabled={isLoading}
        />
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 transition-colors"
          disabled={isLoading}
        >
          {buttonText}
        </Button>
      </div>
      
      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToLogin}
          className="text-green-600 hover:text-green-700"
          disabled={isLoading}
        >
          Already have an account? Sign In
        </Button>
      </div>
    </form>
  );
}
