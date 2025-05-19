
export interface ConnectionState {
  isConnected: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  responseTime: number | null;
  reconnecting: boolean;
  connectionError: string | null;
  consecutiveErrors: number;
}

export interface ConnectionCache {
  isConnected: boolean;
  timestamp: number;
  ttl: number;
  responseTime: number | null;
}

export interface ConnectionContextType {
  connectionState: ConnectionState;
  checkConnection: () => Promise<boolean>;
  resetConnection: () => Promise<void>;
}
