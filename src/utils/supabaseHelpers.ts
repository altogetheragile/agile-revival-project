
// This file is kept for backward compatibility
// All functionality has been moved to the supabase folder
export * from './supabase';

// Additional helper function for monitoring database operations
export const monitorDatabaseOperation = async (
  operation: () => Promise<any>,
  options: {
    operationName: string;
    retries?: number;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
  }
) => {
  const { operationName, retries = 2, onSuccess, onError } = options;
  let attempts = 0;
  let lastError: any = null;

  while (attempts <= retries) {
    try {
      console.log(`[DB Monitor] Executing ${operationName} (attempt ${attempts + 1}/${retries + 1})`);
      const startTime = performance.now();
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`[DB Monitor] ${operationName} completed in ${duration.toFixed(2)}ms`);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      console.error(`[DB Monitor] Error in ${operationName} (attempt ${attempts + 1}/${retries + 1}):`, error);
      attempts++;
      
      if (attempts <= retries) {
        // Wait before retrying with exponential backoff
        const delay = Math.min(1000 * (2 ** (attempts - 1)), 10000);
        console.log(`[DB Monitor] Retrying ${operationName} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  if (onError) {
    onError(lastError);
  }
  
  throw lastError || new Error(`${operationName} failed after ${retries + 1} attempts`);
};
