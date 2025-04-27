
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localResetEmailSent, setLocalResetEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (email: string) => {
    try {
      setIsSubmitting(true);
      console.log(`Initiating password reset for: ${email}`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }
      
      console.log('Password reset request successful');
      toast.success("Reset email sent", {
        description: "If an account exists with this email, you'll receive reset instructions."
      });
      
      setLocalResetEmailSent(true);
      return { success: true };
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // For security, we still show a success message even on error
      toast.success("Reset email sent", {
        description: "If an account exists with this email, you'll receive reset instructions."
      });
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    localResetEmailSent,
    setLocalResetEmailSent,
    handleResetPassword,
    navigate
  };
}
