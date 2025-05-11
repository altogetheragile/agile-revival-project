
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { testConnection } from '@/utils/supabase/connection';

export type ConnectionStatus = {
  connectionError: boolean;
  retryCount: number;
};

export const MAX_RETRIES = 3;

export const checkDatabaseConnection = async (
  setConnectionError: (value: boolean) => void,
  setRetryCount: (value: number | ((prev: number) => number)) => void,
  setAuthInitialized: (value: boolean) => void
): Promise<void> => {
  try {
    console.log("[AuthContext Debug] Testing database connectivity...");
    const result = await testConnection();
    console.log("[AuthContext Debug] Database connection test result:", result);
    
    if (!result.isConnected) {
      console.error("[AuthContext Debug] Database connectivity issue:", result.error);
      setConnectionError(true);
      
      // Add specific guidance for common error types
      if (result.error?.message?.includes("infinite recursion")) {
        toast.error("Admin verification issue", {
          description: "The database function issue has been fixed. Try refreshing the page.",
          duration: 10000
        });
      } else if (result.responseTime > 8000) {
        toast.warning("Slow database connection", {
          description: "The database is responding slowly which may affect functionality.",
          duration: 8000
        });
      }
    } else {
      setConnectionError(false);
      setRetryCount(0);
    }
  } catch (err) {
    console.error("[AuthContext Debug] Error testing connection:", err);
    setConnectionError(true);
  } finally {
    // Mark auth as initialized even if there was an error
    setAuthInitialized(true);
  }
};

export const setupConnectionMonitoring = (
  connectionError: boolean,
  retryCount: number,
  setConnectionError: (value: boolean) => void,
  setRetryCount: (value: number | ((prev: number) => number)) => void,
  devMode: boolean
): (() => void) | undefined => {
  if (connectionError && retryCount < MAX_RETRIES) {
    const timer = setTimeout(() => {
      console.log(`[AuthContext] Attempting to reconnect (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
      
      // Test the connection
      supabase.auth.getSession()
        .then(({ data, error }) => {
          if (error) {
            console.error("[AuthContext] Reconnection attempt failed:", error);
            setRetryCount(prev => prev + 1);
          } else {
            console.log("[AuthContext] Reconnection successful, resetting error state");
            setConnectionError(false);
            setRetryCount(0);
            
            if (retryCount > 0) {
              toast.success("Connection restored", {
                description: "The connection to the authentication service has been restored."
              });
            }
          }
        })
        .catch(err => {
          console.error("[AuthContext] Error during reconnection:", err);
          setRetryCount(prev => prev + 1);
        });
    }, 5000 * Math.pow(2, retryCount)); // Exponential backoff
    
    return () => clearTimeout(timer);
  } else if (connectionError && retryCount >= MAX_RETRIES) {
    // Suggest refreshing the page if all reconnection attempts fail
    toast.error("Authentication service unavailable", {
      description: "Try refreshing the page or using Dev Mode as a temporary workaround.",
      duration: 10000
    });
  }
  
  return undefined;
};
