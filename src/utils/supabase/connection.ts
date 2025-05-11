
import { supabase } from "@/integrations/supabase/client";
import { ConnectionCheckResult } from "./types";
import { createTimeoutController, executeWithTimeout } from "./controllers";
import { toast } from "sonner";

/**
 * Test database connectivity with enhanced error diagnostics
 */
export async function testConnection(timeoutMs: number = 5000): Promise<ConnectionCheckResult> {
  console.log("[Supabase Connection] Testing database connection...");
  const startTime = Date.now();
  
  try {
    const { result, error } = await executeWithTimeout(
      async (signal) => {
        // Try a simple query to test connectivity
        return await supabase
          .from('site_settings')
          .select('key')
          .limit(1)
          .abortSignal(signal);
      },
      {
        timeoutMs,
        retries: 1,
        silentRetry: true,
        onTimeout: () => console.error("[Supabase Connection] Connection test timed out")
      }
    );
    
    const responseTime = Date.now() - startTime;
    
    if (error || result?.error) {
      const actualError = error || result?.error;
      console.error("[Supabase Connection] Connection test failed:", actualError);
      
      // Categorize the error for better diagnostics
      let errorType = 'Unknown';
      let errorMessage = actualError?.message || 'Unknown error occurred';
      
      if (errorMessage.includes('violates row-level security policy')) {
        errorType = 'RLS Policy';
      } else if (errorMessage.includes('timeout') || responseTime >= timeoutMs) {
        errorType = 'Timeout';
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        errorType = 'Network';
      } else if (errorMessage.includes('permission denied')) {
        errorType = 'Permission';
      } else if (errorMessage.includes('infinite recursion')) {
        errorType = 'Recursion';
      } else if (errorMessage.includes('control reached end of trigger')) {
        errorType = 'Trigger';
        errorMessage = 'Database trigger error. Please contact the administrator.';
      }
      
      console.log(`[Supabase Connection] Error type: ${errorType}`);
      
      return {
        isConnected: false,
        responseTime,
        error: {
          ...actualError,
          type: errorType,
          message: errorMessage
        }
      };
    }
    
    console.log(`[Supabase Connection] Connection test successful, response time: ${responseTime}ms`);
    return {
      isConnected: true,
      responseTime,
      data: result?.data
    };
  } catch (err) {
    const responseTime = Date.now() - startTime;
    
    console.error("[Supabase Connection] Unexpected error during connection test:", err);
    return {
      isConnected: false,
      responseTime,
      error: err
    };
  }
}

/**
 * Test database connectivity and show user feedback
 */
export async function checkDatabaseHealth(silent: boolean = false): Promise<ConnectionCheckResult> {
  const result = await testConnection();
  
  if (!silent) {
    if (!result.isConnected) {
      toast.error("Database connection issue", {
        description: getConnectionErrorDescription(result.error)
      });
    } else if (result.responseTime > 5000) {
      toast.warning("Slow database connection", {
        description: `The database is responding slowly (${result.responseTime}ms), which may affect performance.`
      });
    } else {
      toast.success("Database connection healthy", {
        description: `Connected successfully (${result.responseTime}ms)`
      });
    }
  }
  
  return result;
}

/**
 * Get a user-friendly description of a connection error
 */
export function getConnectionErrorDescription(error: any): string {
  if (!error) return "Could not connect to the database. Please check your internet connection.";
  
  switch (error.type) {
    case 'RLS Policy':
      return "Permission error. Please try enabling Dev Mode as a temporary workaround.";
    case 'Timeout':
      return "The database took too long to respond. Please try again later.";
    case 'Network':
      return "Network error. Please check your internet connection.";
    case 'Permission':
      return "You don't have permission to access the database. Try enabling Dev Mode.";
    case 'Recursion':
      return "The database is experiencing a configuration issue. Please try again later.";
    case 'Trigger':
      return "Database trigger error. This is a database configuration issue that requires administrator attention.";
    default:
      return error.message || "Unknown database error occurred.";
  }
}
