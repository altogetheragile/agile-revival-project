
import { useResetPassword } from '@/hooks/useResetPassword';
import { ResetPasswordForm } from '../reset-password/ResetPasswordForm';
import { useAuthForm } from '@/contexts/AuthFormContext';

interface ResetPasswordViewProps {
  onSubmit: (email: string) => Promise<void>;
  error: string | null;
  resetEmailSent: boolean;
}

export default function ResetPasswordView({ 
  onSubmit, 
  error, 
  resetEmailSent 
}: ResetPasswordViewProps) {
  const { loading, setMode } = useAuthForm();
  const {
    handleResetPassword,
    isSubmitting,
    error: resetError,
    localResetEmailSent
  } = useResetPassword();

  // Wrapper function to convert the return type from Promise<{success, error}> to Promise<void>
  const handleSubmit = async (email: string): Promise<void> => {
    const result = await handleResetPassword(email);
    // We're ignoring the return value since the parent component expects Promise<void>
    // The hook already handles setting error states and success states internally
    return;
  };

  return (
    <ResetPasswordForm
      onSubmit={handleSubmit}
      onSwitchToLogin={() => setMode('login')}
      loading={loading || isSubmitting}
      error={error || resetError}
      resetEmailSent={resetEmailSent || localResetEmailSent}
    />
  );
}
