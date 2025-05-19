
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { executeQuery } from '@/utils/supabase/query';
import { ConnectionCache } from './types';

// Create a shared cache to improve connection check performance
export const connectionCache: ConnectionCache = {
  isConnected: false,
  timestamp: 0,
  ttl: 5000, // 5 seconds cache TTL
  responseTime: null,
};

/**
 * Execute a simple query to test the database connection
 */
export async function executeConnectionCheck(devMode: boolean, timeoutMs = 20000): Promise<{
  isConnected: boolean;
  responseTime: number | null;
  error: any | null;
}> {
  console.log("🏓 Testing connection with ping request...");
  
  // In Dev Mode, we should log the attempt but we don't need to wait for a response
  if (devMode) {
    console.log("⚙️ [Dev Mode] Connection check - still trying real connection but won't block UI");
  }
  
  try {
    const startTime = Date.now();
    const { data, error } = await executeQuery<any[]>(
      async (signal) => await supabase
        .from('site_settings')
        .select('key')
        .limit(1),
      {
        timeoutMs,
        showErrorToast: false,
        silentRetry: true,
        retries: 1
      }
    );
    
    const responseTime = Date.now() - startTime;
    const isConnected = !error;
    
    // Log details about the connection check
    if (isConnected) {
      console.log(`✅ Connection check succeeded in ${responseTime}ms`);
    } else {
      console.error(`❌ Connection check failed:`, error);
    }
    
    return { isConnected, responseTime, error };
  } catch (err) {
    console.error("💔 Error checking connection:", err);
    return { isConnected: false, responseTime: null, error: err };
  }
}

/**
 * Show a toast notification for connection status changes
 */
export function showConnectionStatusToast(isConnected: boolean, reconnecting: boolean, responseTime: number | null): void {
  if (isConnected && reconnecting) {
    toast.success("Connection restored", {
      description: responseTime ? `Connected to database (${responseTime}ms)` : "Connected to database"
    });
  } else if (!isConnected) {
    toast.error("Database connection issue", {
      description: "Could not connect to the database. Try enabling Dev Mode."
    });
  }
}

/**
 * Handle multiple consecutive errors that could indicate RLS recursion issues
 */
export function handleConsecutiveErrors(consecutiveErrors: number): void {
  if (consecutiveErrors >= 3 && consecutiveErrors === 3) {
    console.error(`❗ Multiple consecutive connection errors (${consecutiveErrors}). Possible RLS recursion issue.`);
    toast.error("Database connection issues detected", {
      description: "There might be an issue with database permissions. If this persists, try enabling Dev Mode.",
      duration: 8000,
    });
  }
}
