
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

const ResetPasswordForm = ({ onBackToLogin }: { onBackToLogin: () => void }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success("Reset email sent", {
        description: "If an account exists with this email, you'll receive reset instructions."
      });
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // For security reasons, we still show success even if there's an error
      setEmailSent(true);
      toast.success("Reset email sent", {
        description: "If an account exists with this email, you'll receive reset instructions."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            If an account exists with this email address, we've sent instructions to reset your password.
          </AlertDescription>
        </Alert>
        <Button onClick={onBackToLogin} className="w-full">
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="youremail@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
          <Button type="button" variant="ghost" onClick={onBackToLogin} className="w-full">
            Back to Login
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
