
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
      } else if (result.error?.message?.includes("policy")) {
        toast.error("Permission error", {
          description: "There might be Row Level Security policy issues. Try using Dev Mode temporarily.",
          duration: 8000
        });
      } else if (result.responseTime > 8000) {
        toast.warning("Slow database connection", {
          description: "The database is responding slowly which may affect functionality.",
          duration: 8000
        });
      } else {
        toast.error("Connection error", {
          description: "Unable to connect to the database. Try refreshing or using Dev Mode.",
          duration: 6000
        });
      }
    } else {
      setConnectionError(false);
      setRetryCount(0);
      console.log("[AuthContext Debug] Database connection successful");
    }
  } catch (err) {
    console.error("[AuthContext Debug] Error testing connection:", err);
    setConnectionError(true);
    toast.error("Connection check failed", {
      description: "Could not verify database connectivity. Network issues may be present.",
      duration: 7000
    });
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
  // Don't attempt reconnection in dev mode
  if (devMode) {
    return undefined;
  }
  
  if (connectionError && retryCount < MAX_RETRIES) {
    // Exponential backoff with jitter for more reliable reconnection
    const baseDelay = 5000;
    const exponentialDelay = baseDelay * Math.pow(2, retryCount);
    const jitter = Math.random() * 1000;
    const delay = exponentialDelay + jitter;
    
    console.log(`[AuthContext] Scheduling reconnect attempt ${retryCount + 1}/${MAX_RETRIES} in ${Math.round(delay/1000)}s`);
    
    const timer = setTimeout(() => {
      console.log(`[AuthContext] Attempting to reconnect (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
      
      // Test the connection with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      supabase.auth.getSession()
        .then(({ data, error }) => {
          clearTimeout(timeoutId);
          
          if (error) {
            console.error("[AuthContext] Reconnection attempt failed:", error);
            setRetryCount(prev => prev + 1);
            
            // More specific error messaging
            if (error.message?.includes("Failed to fetch")) {
              toast.error("Network issue", {
                description: "Cannot reach the database. Check your internet connection.",
              });
            } else {
              toast.error("Reconnection failed", {
                description: `Attempt ${retryCount + 1}/${MAX_RETRIES} failed. Will try again shortly.`,
              });
            }
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
          clearTimeout(timeoutId);
          console.error("[AuthContext] Error during reconnection:", err);
          setRetryCount(prev => prev + 1);
          
          if (err.name === 'AbortError') {
            toast.error("Connection timeout", {
              description: "The server took too long to respond. Will retry again.",
            });
          }
        });
    }, delay);
    
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
