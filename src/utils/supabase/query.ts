
import { toast } from 'sonner';
import { executeWithTimeout } from '../supabase/controllers';
import { ConnectionErrorType, ConnectionError } from './types';

/**
 * Enhanced query execution with error handling, timeout, and retries
 * @param queryFn Function that executes the query with an abort signal
 * @param options Configuration options
 * @returns Result of the query execution
 */
export async function executeQuery<T>(
  queryFn: (signal: AbortSignal) => Promise<T>,
  {
    timeoutMs = 20000,
    showErrorToast = true,
    errorMessage = "Database operation failed",
    retries = 2,
    silentRetry = false
  }: {
    timeoutMs?: number;
    showErrorToast?: boolean;
    errorMessage?: string;
    retries?: number;
    silentRetry?: boolean;
  } = {}
): Promise<{ data: T | null; error: Error | null }> {
  const { result, error } = await executeWithTimeout(
    queryFn,
    {
      timeoutMs,
      retries,
      retryDelay: 1000,
      silentRetry,
      onTimeout: () => {
        if (showErrorToast) {
          toast.error("Request timed out", {
            description: "The database request took too long to respond."
          });
        }
      },
      onError: (err) => {
        if (showErrorToast) {
          // Handle this in the return phase to provide better error messages
        }
      }
    }
  );

  if (error) {
    console.error("Query execution error:", error);
    
    // Parse error to provide more specific error messages
    const parsedError = parseConnectionError(error);
    
    if (showErrorToast) {
      switch (parsedError.type) {
        case 'RLS Policy':
          toast.error("Permission error", {
            description: "You don't have permission to access this resource."
          });
          break;
        case 'Recursion':
          toast.error("System error", {
            description: "A database configuration issue was detected. Refresh the page or try again later."
          });
          break;
        case 'Timeout':
          toast.error("Connection timeout", {
            description: "The database request timed out. Please try again."
          });
          break;
        case 'Network':
          toast.error("Network error", {
            description: "Unable to connect to the database. Check your connection."
          });
          break;
        default:
          toast.error(errorMessage, {
            description: parsedError.message || "An unexpected error occurred."
          });
      }
    }
    
    return { data: null, error: error as Error };
  }

  return { data: result as T, error: null };
}

/**
 * Parse connection errors to provide more specific error types and messages
 */
export function parseConnectionError(error: any): ConnectionError {
  const errorMessage = error?.message || "Unknown error";
  
  // Check for specific error patterns
  if (errorMessage.includes("infinite recursion detected in policy")) {
    return {
      type: 'Recursion',
      message: "Database policy recursion detected. This is a system configuration issue.",
      details: errorMessage,
      originalError: error
    };
  }
  
  if (errorMessage.includes("violates row-level security policy") || 
      errorMessage.includes("permission denied")) {
    return {
      type: 'RLS Policy',
      message: "You don't have permission to perform this operation.",
      details: errorMessage,
      originalError: error
    };
  }
  
  if (error.name === 'AbortError' || errorMessage.includes('timeout') || 
      errorMessage.includes('timed out')) {
    return {
      type: 'Timeout',
      message: "The request timed out. Please try again later.",
      details: errorMessage,
      originalError: error
    };
  }
  
  if (errorMessage.includes("network") || errorMessage.includes("fetch") || 
      errorMessage.includes("connection")) {
    return {
      type: 'Network',
      message: "Network connection issue. Please check your internet connection.",
      details: errorMessage,
      originalError: error
    };
  }

  return {
    type: 'Unknown',
    message: errorMessage,
    originalError: error
  };
}
