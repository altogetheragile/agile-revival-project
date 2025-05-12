
import { supabase } from '@/integrations/supabase/client';
import { ConnectionCheckResult } from './types';
import { toast } from 'sonner';

/**
 * Test the connection to the Supabase database
 */
export const testConnection = async (): Promise<ConnectionCheckResult> => {
  console.log("[Connection] Testing database connection...");
  
  const startTime = Date.now();
  let isConnected = false;
  let error = null;
  let data = null;
  
  try {
    // Perform a simple query that doesn't require authentication
    const response = await supabase
      .from('site_settings')
      .select('key')
      .limit(1)
      .maybeSingle();
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.error) {
      console.error("[Connection] Database test query failed:", response.error);
      error = response.error;
      isConnected = false;
    } else {
      console.log(`[Connection] Database connection successful. Response time: ${responseTime}ms`);
      isConnected = true;
      data = response.data;
    }
    
    return { isConnected, responseTime, data, error };
  } catch (err) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.error("[Connection] Database connection test error:", err);
    
    return {
      isConnected: false,
      responseTime,
      error: err
    };
  }
};

/**
 * Check if database connection is healthy and handle common errors
 */
export const checkDatabaseHealth = async (): Promise<ConnectionCheckResult> => {
  console.log("[Health Check] Checking database health...");
  const result = await testConnection();
  
  if (!result.isConnected) {
    // Check for specific error types
    const errorMessage = result.error?.message || "Unknown connection error";
    
    if (errorMessage.includes("infinite recursion detected in policy")) {
      toast.error("Database configuration issue", {
        description: "A recursion in database policies was detected. This is a system issue that needs attention.",
        duration: 8000
      });
    } else if (result.responseTime > 5000) {
      toast.warning("Slow database connection", {
        description: `The database is responding slowly (${result.responseTime}ms), which may affect performance.`,
        duration: 5000
      });
    } else {
      toast.error("Database connection issue", {
        description: "Unable to connect to the database. Please try again later.",
        duration: 5000
      });
    }
  }
  
  return result;
};
