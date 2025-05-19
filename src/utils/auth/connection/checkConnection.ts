
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { testConnection } from '@/utils/supabase/connection';
import { ConnectionStatus, MAX_RETRIES } from './types';

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
