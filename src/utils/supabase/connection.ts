
import { supabase } from "@/integrations/supabase/client";
import { executeQuery } from "./query";
import { ConnectionCheckResult } from "./types";
import { createTimeoutController } from "./controllers";

/**
 * Test database connectivity
 */
export async function testConnection(): Promise<ConnectionCheckResult> {
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
        return {
          isConnected: false,
          responseTime,
          error
        };
      }
      
      return {
        isConnected: true,
        responseTime
      };
    } catch (err) {
      clearTimeout(timeoutId);
      
      if (err instanceof DOMException && err.name === 'AbortError') {
        return {
          isConnected: false,
          responseTime: Date.now() - startTime,
          error: new Error("Connection timed out")
        };
      }
      
      return {
        isConnected: false,
        responseTime: Date.now() - startTime,
        error: err
      };
    }
  } catch (err) {
    return {
      isConnected: false,
      responseTime: Date.now() - startTime,
      error: err
    };
  }
}
