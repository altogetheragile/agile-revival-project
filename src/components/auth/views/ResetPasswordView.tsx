
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

  const handleSubmit = async (email: string): Promise<void> => {
    try {
      // Try both the provided onSubmit and our hook implementation
      await Promise.all([
        onSubmit(email).catch(e => console.log('onSubmit error:', e)),
        initiatePasswordReset(email).catch(e => console.log('initiatePasswordReset error:', e))
      ]);
    } catch (error) {
      console.error('Error in ResetPasswordView.handleSubmit:', error);
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
