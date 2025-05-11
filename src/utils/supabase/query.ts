
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { handleError } from "@/utils/errorHandler";
import { toast } from "sonner";
import { QueryOptions } from "./types";
import { createTimeoutController } from "./controllers";
import { supabase } from "@/integrations/supabase/client";
import { checkDatabaseHealth } from "./connection";

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_RETRIES = 1; // Set default to 1 retry

/**
 * Execute a Supabase query with standardized error handling and timeout
 * @param queryFn Function that returns a query builder or Promise
 * @param options Configuration options for the query execution
 * @returns Promise with data and error fields
 */
export async function executeQuery<T>(
  queryFn: (signal: AbortSignal) => Promise<PostgrestSingleResponse<T>> | any,
  options: QueryOptions = {}
): Promise<{ data: T | null; error: any | null }> {
  const { 
    timeoutMs = DEFAULT_TIMEOUT, 
    showErrorToast = true, 
    errorMessage, 
    retries = DEFAULT_RETRIES, 
    silentRetry = false 
  } = options;
  
  let currentRetry = 0;
  
  // Check connection health before executing query
  const connectionStatus = await checkDatabaseHealth(true);
  if (!connectionStatus.isConnected && connectionStatus.error?.type === 'Trigger') {
    if (showErrorToast) {
      toast.error("Database configuration issue", {
        description: "There's an issue with the database triggers. Please contact the administrator."
      });
    }
    return { 
      data: null, 
      error: new Error("Database trigger error detected. This requires administrator attention.")
    };
  }
  
  while (currentRetry <= retries) {
    try {
      // Create controller with timeout
      const { controller, timeoutId } = createTimeoutController(timeoutMs);
      
      try {
        // Execute the query function with the abort signal
        const query = queryFn(controller.signal);
        
        // Handle both Promise and Query Builder return types
        const result = query instanceof Promise 
          ? await query 
          : await query;
        
        clearTimeout(timeoutId);
        
        if (result.error) {
          if (result.error.message?.includes('control reached end of trigger')) {
            if (showErrorToast) {
              toast.error("Database trigger error", {
                description: "There's an issue with the database configuration. Please contact the administrator."
              });
            }
            return { data: null, error: result.error };
          }
          
          if (currentRetry < retries) {
            if (!silentRetry) {
              console.log(`Query failed (attempt ${currentRetry + 1}/${retries + 1}), retrying...`);
            }
            currentRetry++;
            await new Promise(resolve => setTimeout(resolve, 1000 * currentRetry)); // Progressive backoff
            continue;
          }
          
          if (showErrorToast) {
            if (result.error.message?.includes('Failed to fetch') || 
                result.error.message?.includes('Network error')) {
              toast.error("Connection lost", {
                description: "Unable to reach the database. Please check your internet connection."
              });
            } else {
              handleError(result.error, errorMessage);
            }
          }
          
          return { data: null, error: result.error };
        }
        
        return { data: result.data as T, error: null };
      } catch (err) {
        clearTimeout(timeoutId);
        
        if (err instanceof DOMException && err.name === 'AbortError') {
          if (currentRetry < retries) {
            if (!silentRetry) {
              console.log(`Query timed out (attempt ${currentRetry + 1}/${retries + 1}), retrying...`);
            }
            currentRetry++;
            await new Promise(resolve => setTimeout(resolve, 1000 * currentRetry)); // Progressive backoff
            continue;
          }
          
          const timeoutError = new Error(`Request timed out after ${timeoutMs}ms`);
          
          if (showErrorToast) {
            handleError({
              message: `Request timed out after ${timeoutMs}ms`,
              details: 'The database query took too long to respond'
            }, errorMessage || 'Request timed out');
          }
          
          return { data: null, error: timeoutError };
        }
        
        // Check for trigger errors
        if (err instanceof Error && err.message?.includes('control reached end of trigger')) {
          if (showErrorToast) {
            toast.error("Database trigger error", {
              description: "There's an issue with the database configuration. Please contact the administrator."
            });
          }
          return { data: null, error: err };
        }
        
        if (currentRetry < retries) {
          if (!silentRetry) {
            console.log(`Query error (attempt ${currentRetry + 1}/${retries + 1}), retrying...`, err);
          }
          currentRetry++;
          await new Promise(resolve => setTimeout(resolve, 1000 * currentRetry)); // Progressive backoff
          continue;
        }
        
        if (showErrorToast) {
          if (err instanceof Error && 
             (err.message?.includes('Failed to fetch') || err.message?.includes('Network error'))) {
            toast.error("Connection lost", {
              description: "Unable to reach the database. Please check your internet connection."
            });
          } else {
            handleError(err, errorMessage);
          }
        }
        
        return { data: null, error: err };
      }
    } catch (outerError) {
      if (currentRetry < retries) {
        if (!silentRetry) {
          console.log(`Unexpected error (attempt ${currentRetry + 1}/${retries + 1}), retrying...`, outerError);
        }
        currentRetry++;
        await new Promise(resolve => setTimeout(resolve, 1000 * currentRetry)); // Progressive backoff
        continue;
      }
      
      if (showErrorToast) {
        handleError(outerError, errorMessage);
      }
      
      return { data: null, error: outerError };
    }
  }
  
  // This should never happen but TypeScript needs it
  return { data: null, error: new Error("Maximum retries exceeded") };
}
