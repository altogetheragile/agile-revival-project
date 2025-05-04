
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandler';

export function usePasswordReset() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localResetEmailSent, setLocalResetEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const initiatePasswordReset = async (email: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      console.log(`Initiating password reset for: ${email}`);
      
      // Show loading toast immediately
      toast({
        title: "Processing",
        description: "Sending password reset link..."
      });

      if (!email || typeof email !== 'string' || email.trim() === '') {
        throw new Error('Please enter a valid email address');
      }

      // Try multiple approaches for better reliability
      try {
        // Approach 1: Use our dedicated edge function
        console.log('Attempting password reset via edge function');
        const { error: edgeFunctionError } = await supabase.functions.invoke('send-password-reset', {
          body: { 
            email: email.trim(),
            redirectUrl: `${window.location.origin}/reset-password`
          }
        });
        
        if (edgeFunctionError) {
          console.error('Edge function reset error:', edgeFunctionError);
          // Continue to try other methods
        } else {
          console.log('Password reset via edge function successful');
        }
      } catch (edgeFunctionError) {
        console.error('Edge function call failed:', edgeFunctionError);
        // Continue to other methods
      }
      
      try {
        // Approach 2: Use standard Supabase method
        console.log('Attempting password reset via Supabase Auth API');
        const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (supabaseError) {
          console.error('Supabase password reset error:', supabaseError);
          // Still show success for security reasons
        } else {
          console.log('Password reset request through Supabase successful');
        }
      } catch (supabaseError) {
        console.error('Supabase reset method error:', supabaseError);
      }
      
      // Show success toast
      toast({
        title: "Email sent",
        description: "If an account exists with this email, you'll receive reset instructions."
      });
      
      setLocalResetEmailSent(true);
      return { success: true };
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // For security, we still show a success message even on error
      toast({
        title: "Email sent",
        description: "If an account exists with this email, you'll receive reset instructions."
      });
      
      // But we'll set the error for debugging purposes
      setError(error.message || "An unexpected error occurred");
      
      // Still mark as sent for security reasons
      setLocalResetEmailSent(true);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const completePasswordReset = async (newPassword: string) => {
    try {
      setIsSubmitting(true);
      console.log('Attempting to update password...');
      
      if (!newPassword || newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        throw error;
      }

      console.log('Password updated successfully');
      toast({
        title: "Success",
        description: "Your password has been updated successfully"
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Password update error:', error);
      setError(error.message || "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to update password"
      });
      return { success: false, error };
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
    initiatePasswordReset,
    completePasswordReset,
    navigate
  };
}
