
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { testConnection } from "./supabaseHelpers";

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
  return testConnection();
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
