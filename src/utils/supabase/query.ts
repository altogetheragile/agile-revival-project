
import { toast } from "sonner";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";

export interface QueryOptions {
  timeoutMs?: number;
  retries?: number;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: PostgrestError | Error) => void;
}

export interface QueryResult<T> {
  data: T | null;
  error: PostgrestError | Error | null;
}

/**
 * Execute a Supabase query with options for timeout, retries, and error handling
 */
export async function executeQuery<T>(
  queryFn: (signal: AbortSignal) => Promise<PostgrestSingleResponse<T>>,
  options: QueryOptions = {}
): Promise<QueryResult<T>> {
  const { 
    timeoutMs = 5000, 
    retries = 1, 
    errorMessage = "Query failed", 
    onSuccess, 
    onError 
  } = options;

  let attemptCount = 0;
  let lastError: PostgrestError | Error | null = null;

  while (attemptCount <= retries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const result = await queryFn(controller.signal);
      clearTimeout(timeoutId);
      
      if (result.error) {
        lastError = result.error;
        console.error(`Query attempt ${attemptCount + 1} failed:`, result.error);
        
        // Handle specific errors
        if (result.error.code === '54000' && result.error.message.includes('infinite recursion detected')) {
          toast.error("Database configuration issue", {
            description: "A recursion in database policies was detected."
          });
          onError?.(result.error);
          return { data: null, error: result.error };
        }
        
        if (attemptCount >= retries) {
          onError?.(result.error);
          return { data: null, error: result.error };
        }
      } else {
        // Success
        onSuccess?.();
        return { data: result.data, error: null };
      }
    } catch (error) {
      lastError = error as Error;
      console.error(`Query attempt ${attemptCount + 1} threw error:`, error);
      
      // Handle abort errors differently
      if (error instanceof DOMException && error.name === 'AbortError') {
        toast.error("Request timeout", {
          description: `The request took longer than ${timeoutMs/1000} seconds and was aborted.`
        });
        onError?.(error);
        return { data: null, error };
      }
      
      if (attemptCount >= retries) {
        onError?.(error as Error);
        return { data: null, error: error as Error };
      }
    }
    
    // Exponential backoff
    const delay = Math.min(1000 * Math.pow(2, attemptCount), 8000);
    await new Promise(resolve => setTimeout(resolve, delay));
    attemptCount++;
  }
  
  // If we get here, all retries failed
  if (lastError) {
    toast.error(errorMessage, {
      description: lastError.message || "An unexpected error occurred",
    });
  }
  
  return { data: null, error: lastError };
}
