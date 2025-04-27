
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

  // Either use the hook's reset handler or the parent's handler
  const handleSubmit = async (email: string) => {
    return handleResetPassword(email);
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
