
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

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
      
      // Show toast to indicate that we're starting the authentication process
      toast({
        title: "Connecting to Google",
        description: "Opening Google authentication window...",
      });
      
      console.log("Starting Google auth flow");
      console.log("Current origin:", window.location.origin);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
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
      
      if (error) {
        console.error("Google auth error:", error);
        throw error;
      }
      
      // If we get this far without an error, the OAuth flow has started successfully
      console.log("OAuth flow started successfully", data);
      
    } catch (error: any) {
      console.error("Google sign in error:", error);
      
      // Provide more specific error messages based on the error
      let errorMessage = "Failed to connect with Google";
      
      if (error.message?.includes("provider is not enabled")) {
        errorMessage = "Google authentication is not enabled in your Supabase project";
      } else if (error.message?.includes("popup blocked")) {
        errorMessage = "Popup was blocked by your browser. Please enable popups for this site";
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error. Please check your internet connection";
      } else if (error.message?.includes("timeout")) {
        errorMessage = "Connection timed out. Please try again";
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive"
      });
      
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
