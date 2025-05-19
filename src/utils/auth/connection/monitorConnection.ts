
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MAX_RETRIES } from './types';

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
