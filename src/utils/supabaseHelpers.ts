
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";
import { ErrorType, handleError } from "@/utils/errorHandler";

interface QueryOptions {
  timeoutMs?: number;
  showErrorToast?: boolean;
  errorMessage?: string;
  retries?: number;
}

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_RETRIES = 0;

/**
 * Creates an AbortController with timeout
 */
export const createTimeoutController = (timeoutMs: number = DEFAULT_TIMEOUT): { 
  controller: AbortController, 
  timeoutId: NodeJS.Timeout 
} => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
};

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
  const { timeoutMs = DEFAULT_TIMEOUT, showErrorToast = true, errorMessage, retries = DEFAULT_RETRIES } = options;
  
  let currentRetry = 0;
  
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
          if (currentRetry < retries) {
            console.log(`Query failed (attempt ${currentRetry + 1}/${retries + 1}), retrying...`);
            currentRetry++;
            await new Promise(resolve => setTimeout(resolve, 1000 * currentRetry)); // Progressive backoff
            continue;
          }
          
          if (showErrorToast) {
            handleError(result.error, errorMessage);
          }
          
          return { data: null, error: result.error };
        }
        
        return { data: result.data as T, error: null };
      } catch (err) {
        clearTimeout(timeoutId);
        
        if (err instanceof DOMException && err.name === 'AbortError') {
          if (currentRetry < retries) {
            console.log(`Query timed out (attempt ${currentRetry + 1}/${retries + 1}), retrying...`);
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
        
        if (currentRetry < retries) {
          console.log(`Query error (attempt ${currentRetry + 1}/${retries + 1}), retrying...`, err);
          currentRetry++;
          await new Promise(resolve => setTimeout(resolve, 1000 * currentRetry)); // Progressive backoff
          continue;
        }
        
        if (showErrorToast) {
          handleError(err, errorMessage);
        }
        
        return { data: null, error: err };
      }
    } catch (outerError) {
      if (currentRetry < retries) {
        console.log(`Unexpected error (attempt ${currentRetry + 1}/${retries + 1}), retrying...`, outerError);
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

/**
 * Test database connectivity
 */
export async function testConnection(): Promise<{
  isConnected: boolean;
  responseTime: number;
  error?: any;
}> {
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
