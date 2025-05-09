
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Interface for the connection status result
export interface ConnectionStatus {
  isConnected: boolean;
  responseTime: number;
  error?: any;
}

/**
 * Tests the connection to the Supabase database
 * @returns Object containing connection status information
 */
export const testDatabaseConnection = async (): Promise<ConnectionStatus> => {
  const startTime = Date.now();
  try {
    // Make a simple query to test the connection
    const { data, error } = await supabase
      .from('site_settings')
      .select('key')
      .limit(1)
      .timeout(10000) // 10 second timeout
      .maybeSingle();
      
    const responseTime = Date.now() - startTime;
    
    if (error) {
      console.error("Database connection test failed:", error);
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
    console.error("Error testing database connection:", err);
    return {
      isConnected: false,
      responseTime: Date.now() - startTime,
      error: err
    };
  }
};

/**
 * Performs a health check on the database and shows appropriate notifications
 */
export const performDatabaseHealthCheck = async (): Promise<ConnectionStatus> => {
  const status = await testDatabaseConnection();
  
  if (!status.isConnected) {
    toast.error("Database connection issue", {
      description: "Could not connect to the database. Please try again later."
    });
  } else if (status.responseTime > 5000) {
    // If response time is very slow, show a warning
    toast.warning("Slow database connection", {
      description: `The database is responding slowly (${status.responseTime}ms), which may affect performance.`
    });
  } else {
    console.log(`Database connection healthy. Response time: ${status.responseTime}ms`);
  }
  
  return status;
};
