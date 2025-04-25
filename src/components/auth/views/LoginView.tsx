
import { useAuthForm } from '@/contexts/AuthFormContext';
import GoogleSignInButton from '../GoogleSignInButton';
import AuthDivider from '../AuthDivider';
import LoginForm from '../LoginForm';

interface LoginViewProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error: string | null;
}

export default function LoginView({ onSubmit, error }: LoginViewProps) {
  const { loading, setMode } = useAuthForm();

  return (
    <div className="space-y-4">
      <GoogleSignInButton 
        mode="login"
        loading={loading}
        onError={(error) => console.error(error)}
      />
      <AuthDivider />
      <LoginForm
        onSubmit={onSubmit}
        onSwitchToSignup={() => setMode('signup')}
        onSwitchToReset={() => setMode('reset')}
        loading={loading}
        error={error}
      />
    </div>
  );
}
