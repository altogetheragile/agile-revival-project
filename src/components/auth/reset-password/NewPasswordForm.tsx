
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { useToast } from '@/hooks/use-toast';

interface NewPasswordFormProps {
  onSuccess: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export function NewPasswordForm({ onSuccess, error, setError }: NewPasswordFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updatePassword } = useAuthMethods();
  const { toast } = useToast();

  const validateForm = () => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await updatePassword(newPassword);
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully reset",
      });
      
      onSuccess();
      
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setError(error.message || 'Failed to reset password. Please try again.');
      
      toast({
        title: "Error",
        description: error.message || 'Failed to reset password',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={loading}
          placeholder="Enter your new password"
          className="w-full"
          autoComplete="new-password"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          placeholder="Confirm your new password"
          className="w-full"
          autoComplete="new-password"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating Password...
          </>
        ) : (
          'Reset Password'
        )}
      </Button>
      
      <div className="text-center mt-4">
        <Button
          type="button"
          variant="link"
          onClick={() => navigate('/auth')}
          className="text-green-600"
        >
          Back to Sign In
        </Button>
      </div>
    </form>
  );
}
