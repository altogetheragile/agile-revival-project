
import { useAuthForm } from '@/contexts/AuthFormContext';
import GoogleSignInButton from '../GoogleSignInButton';
import AuthDivider from '../AuthDivider';
import SignupForm from '../SignupForm';

interface SignupViewProps {
  onSubmit: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  error: string | null;
}

export default function SignupView({ onSubmit, error }: SignupViewProps) {
  const { loading, setMode } = useAuthForm();

  return (
    <div className="space-y-4">
      <GoogleSignInButton 
        mode="signup"
        loading={loading}
        onError={(error) => console.error(error)}
      />
      <AuthDivider />
      <SignupForm
        onSubmit={onSubmit}
        onSwitchToLogin={() => setMode('login')}
        loading={loading}
        error={error}
      />
    </div>
  );
}
