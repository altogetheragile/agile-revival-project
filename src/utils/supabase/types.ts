
// Define connection check result interface
export interface ConnectionCheckResult {
  isConnected: boolean;
  responseTime: number;
  data?: any;
  error?: any;
}

// Define query options interface for enhanced query execution
export interface QueryOptions {
  timeoutMs?: number;
  showErrorToast?: boolean;
  errorMessage?: string;
  retries?: number;
  silentRetry?: boolean;
}

// Define the error types we can detect and handle
export type ConnectionErrorType = 
  | 'RLS Policy'
  | 'Timeout'
  | 'Network'
  | 'Permission'
  | 'Recursion'
  | 'Trigger'
  | 'Unknown';

// Define a structured connection error
export interface ConnectionError {
  type: ConnectionErrorType;
  message: string;
  details?: string;
  originalError?: any;
}
