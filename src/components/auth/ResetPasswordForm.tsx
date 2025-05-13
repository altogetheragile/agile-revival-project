
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResetPasswordFormProps {
  onSubmit: (email: string) => Promise<void>; // Change from onResetClick to onSubmit
  onSwitchToLogin: () => void;
  loading: boolean;
  error: string | null;
  resetEmailSent: boolean; // Change from success to resetEmailSent
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit, // Updated prop name
  onSwitchToLogin,
  loading,
  error,
  resetEmailSent // Updated prop name
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email); // Updated function call
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Reset Password</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email to receive a password reset link
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 p-2 rounded-md text-sm">
            {error}
          </div>
        )}
        {resetEmailSent && (
          <div className="bg-green-50 text-green-600 p-2 rounded-md text-sm">
            Password reset email sent! Check your inbox.
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={loading || resetEmailSent}
        >
          {loading ? "Sending..." : resetEmailSent ? "Email Sent" : "Reset Password"}
        </Button>
      </form>
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Button 
          variant="link" 
          className="p-0" 
          onClick={onSwitchToLogin}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
