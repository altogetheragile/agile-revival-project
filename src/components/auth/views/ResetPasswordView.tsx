
import { useAuthForm } from '@/contexts/AuthFormContext';
import ResetPasswordForm from '../ResetPasswordForm';

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

  return (
    <ResetPasswordForm
      onSubmit={onSubmit}
      onSwitchToLogin={() => setMode('login')}
      loading={loading}
      error={error}
      resetEmailSent={resetEmailSent}
    />
  );
}
