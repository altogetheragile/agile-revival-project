
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
