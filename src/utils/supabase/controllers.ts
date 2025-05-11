
import { toast } from 'sonner';

/**
 * Create an AbortController with timeout
 */
export const createTimeoutController = (timeoutMs: number = 10000): { 
  controller: AbortController, 
  timeoutId: NodeJS.Timeout 
} => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log(`Request timeout after ${timeoutMs}ms`);
    controller.abort();
  }, timeoutMs);
  
  return { controller, timeoutId };
};

/**
 * Execute a function with timeout and retry capabilities
 * @param fn Function to execute
 * @param options Configuration options
 * @returns Result of the function execution
 */
export async function executeWithTimeout<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  {
    timeoutMs = 10000,
    retries = 0,
    retryDelay = 1000,
    onTimeout,
    onError,
    silentRetry = false
  }: {
    timeoutMs?: number;
    retries?: number;
    retryDelay?: number;
    onTimeout?: () => void;
    onError?: (error: any) => void;
    silentRetry?: boolean;
  } = {}
): Promise<{ result: T | null; error: any | null }> {
  let attempt = 0;
  
  while (attempt <= retries) {
    try {
      const { controller, timeoutId } = createTimeoutController(timeoutMs);
      
      try {
        const result = await fn(controller.signal);
        clearTimeout(timeoutId);
        return { result, error: null };
      } catch (err) {
        clearTimeout(timeoutId);
        
        if (err instanceof DOMException && err.name === 'AbortError') {
          if (onTimeout) onTimeout();
          
          if (attempt < retries) {
            if (!silentRetry) {
              console.log(`Operation timed out (attempt ${attempt + 1}/${retries + 1}), retrying...`);
            }
            attempt++;
            await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
            continue;
          }
          
          return { 
            result: null, 
            error: new Error(`Operation timed out after ${timeoutMs}ms`) 
          };
        }
        
        if (onError) onError(err);
        
        if (attempt < retries) {
          if (!silentRetry) {
            console.log(`Operation failed (attempt ${attempt + 1}/${retries + 1}), retrying...`, err);
          }
          attempt++;
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
          continue;
        }
        
        return { result: null, error: err };
      }
    } catch (outerError) {
      if (attempt < retries) {
        attempt++;
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        continue;
      }
      
      return { result: null, error: outerError };
    }
  }
  
  return { 
    result: null, 
    error: new Error("Maximum retry attempts exceeded") 
  };
}
