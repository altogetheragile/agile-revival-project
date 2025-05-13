
import { useAuthForm } from '@/contexts/AuthFormContext';
import AuthDivider from '../AuthDivider';
import ResetPasswordForm from '../reset-password/ResetPasswordForm';
import { useState } from 'react';
import GoogleSignInButton from '../GoogleSignInButton';

interface ResetPasswordViewProps {
  onSubmit: (email: string) => Promise<boolean>;
  error: string | null;
}

export default function ResetPasswordView({ onSubmit, error }: ResetPasswordViewProps) {
  const { loading, setMode } = useAuthForm();
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const handleSubmit = async (email: string) => {
    const success = await onSubmit(email);
    setResetEmailSent(success);
  };

  return (
    <div className="space-y-4">
      <GoogleSignInButton 
        mode="login"
        loading={loading}
        onError={(error) => console.error(error)}
      />
      <AuthDivider />
      <ResetPasswordForm
        onSubmit={handleSubmit}
        onSwitchToLogin={() => setMode('login')}
        loading={loading}
        error={error}
        resetEmailSent={resetEmailSent}
      />
    </div>
  );
}
