
import { supabase } from "@/integrations/supabase/client";
import { ConnectionCheckResult } from "./types";

/**
 * Create an AbortController with timeout
 */
const createTimeoutController = (timeoutMs: number = 10000): { 
  controller: AbortController, 
  timeoutId: NodeJS.Timeout 
} => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
};

/**
 * Test database connectivity
 */
export async function testConnection(timeoutMs: number = 5000): Promise<ConnectionCheckResult> {
  console.log("[Supabase Connection] Testing database connection...");
  const startTime = Date.now();
  
  try {
    const { controller, timeoutId } = createTimeoutController(timeoutMs);
    
    try {
      // Try a simple query to test connectivity
      const { data, error } = await supabase
        .from('site_settings')
        .select('key')
        .limit(1)
        .abortSignal(controller.signal);
      
      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        console.error("[Supabase Connection] Connection test failed:", error);
        
        // Categorize the error for better diagnostics
        let errorType = 'Unknown';
        if (error.message?.includes('violates row-level security policy')) {
          errorType = 'RLS Policy';
        } else if (error.message?.includes('timeout') || responseTime >= timeoutMs) {
          errorType = 'Timeout';
        } else if (error.message?.includes('Failed to fetch')) {
          errorType = 'Network';
        } else if (error.message?.includes('permission denied')) {
          errorType = 'Permission';
        } else if (error.message?.includes('infinite recursion')) {
          errorType = 'Recursion';
        }
        
        console.log(`[Supabase Connection] Error type: ${errorType}`);
        
        return {
          isConnected: false,
          responseTime,
          error: {
            ...error,
            type: errorType
          }
        };
      }
      
      console.log(`[Supabase Connection] Connection test successful, response time: ${responseTime}ms`);
      return {
        isConnected: true,
        responseTime,
        data
      };
    } catch (err) {
      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;
      
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.error("[Supabase Connection] Connection test timed out");
        return {
          isConnected: false,
          responseTime,
          error: new Error("Connection timed out")
        };
      }
      
      console.error("[Supabase Connection] Connection test threw an error:", err);
      return {
        isConnected: false,
        responseTime,
        error: err
      };
    }
  } catch (err) {
    console.error("[Supabase Connection] Unexpected error during connection test:", err);
    return {
      isConnected: false,
      responseTime: Date.now() - startTime,
      error: err
    };
  }
}
