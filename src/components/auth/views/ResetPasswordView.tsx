
import { usePasswordReset } from '@/hooks/usePasswordReset';
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
    isSubmitting,
    error: resetError,
    localResetEmailSent,
    initiatePasswordReset
  } = usePasswordReset();

  // Wrapper function to convert the return type from Promise<{success, error}> to Promise<void>
  const handleSubmit = async (email: string): Promise<void> => {
    try {
      await initiatePasswordReset(email);
      // We're ignoring the return value since the parent component expects Promise<void>
    } catch (error) {
      console.error('Error in ResetPasswordView.handleSubmit:', error);
      // Error is already handled by the hook
    }
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
