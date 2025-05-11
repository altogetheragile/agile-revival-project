
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthErrorMonitoringProps {
  setConnectionError: (value: boolean) => void;
  setRetryCount: (value: number) => void;
}

export const useAuthErrorMonitoring = ({
  setConnectionError,
  setRetryCount
}: AuthErrorMonitoringProps): void => {
  // Handle errors in the auth state
  useEffect(() => {
    // Listen for auth events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log("[AuthContext] User signed out");
      } else if (event === 'SIGNED_IN') {
        console.log("[AuthContext] User signed in");
        // Reset error state on successful sign in
        setConnectionError(false);
        setRetryCount(0);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("[AuthContext] Token refreshed");
      } else if (event === 'USER_UPDATED') {
        console.log("[AuthContext] User updated");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setConnectionError, setRetryCount]);
};
