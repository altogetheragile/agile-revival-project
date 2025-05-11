
export interface QueryOptions {
  timeoutMs?: number;
  showErrorToast?: boolean;
  errorMessage?: string;
  retries?: number;
  silentRetry?: boolean;
}

export interface ConnectionCheckResult {
  isConnected: boolean;
  responseTime: number;
  error?: any;
}
