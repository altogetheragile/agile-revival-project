
import { supabase } from "@/integrations/supabase/client";
import { ConnectionCheckResult } from "./types";
import { createTimeoutController } from "./controllers";

/**
 * Test database connectivity
 */
export async function testConnection(): Promise<ConnectionCheckResult> {
  console.log("[Supabase Connection] Testing database connection...");
  const startTime = Date.now();
  
  try {
    const { controller, timeoutId } = createTimeoutController(5000);
    
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key')
        .limit(1)
        .abortSignal(controller.signal);
      
      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        console.error("[Supabase Connection] Connection test failed:", error);
        return {
          isConnected: false,
          responseTime,
          error
        };
      }
      
      console.log(`[Supabase Connection] Connection test successful, response time: ${responseTime}ms`);
      return {
        isConnected: true,
        responseTime
      };
    } catch (err) {
      clearTimeout(timeoutId);
      
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.error("[Supabase Connection] Connection test timed out");
        return {
          isConnected: false,
          responseTime: Date.now() - startTime,
          error: new Error("Connection timed out")
        };
      }
      
      console.error("[Supabase Connection] Connection test threw an error:", err);
      return {
        isConnected: false,
        responseTime: Date.now() - startTime,
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
