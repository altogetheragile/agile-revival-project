
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

export interface ResetPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onSwitchToLogin: () => void;
  loading: boolean;
  error: string | null;
  resetEmailSent: boolean;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  loading,
  error,
  resetEmailSent
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email);
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
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || resetEmailSent}
            className="w-full"
          />
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {resetEmailSent && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-md text-sm flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Password reset email sent! Please check your inbox and follow the instructions.</span>
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
        <Button 
          variant="link" 
          className="flex items-center justify-center gap-1 mx-auto" 
          onClick={onSwitchToLogin}
          type="button"
        >
          <ArrowLeft className="h-3 w-3" />
          Return to login
        </Button>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
