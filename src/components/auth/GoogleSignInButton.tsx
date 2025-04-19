
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface GoogleSignInButtonProps {
  mode: 'login' | 'signup';
  loading: boolean;
  onError: (error: any) => void;
}

export default function GoogleSignInButton({ mode, loading, onError }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
          queryParams: {
            // Add access_type=offline to get a refresh token
            access_type: 'offline',
            // Force approval prompt to ensure refresh token
            prompt: 'consent'
          }
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleGoogleSignIn}
      className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
      disabled={loading || isLoading}
      type="button"
    >
      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
      {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
    </Button>
  );
}
