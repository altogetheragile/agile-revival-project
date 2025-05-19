
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { executeQuery } from '@/utils/supabase/query';
import { useDevMode } from '@/contexts/DevModeContext';

interface ConnectionState {
  isConnected: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  responseTime: number | null;
  reconnecting: boolean;
  connectionError: string | null;
  consecutiveErrors: number;
}

interface ConnectionContextType {
  connectionState: ConnectionState;
  checkConnection: () => Promise<boolean>;
  resetConnection: () => Promise<void>;
}

const initialState: ConnectionState = {
  isConnected: false,
  isChecking: true,
  lastChecked: null,
  responseTime: null,
  reconnecting: false,
  connectionError: null,
  consecutiveErrors: 0,
};

// Create a shared cache to improve connection check performance
const connectionCache = {
  isConnected: false,
  timestamp: 0,
  ttl: 5000, // 5 seconds cache TTL
  responseTime: null as number | null,
};

const ConnectionContext = createContext<ConnectionContextType>({
  connectionState: initialState,
  checkConnection: async () => false,
  resetConnection: async () => {},
});

export const useConnection = () => useContext(ConnectionContext);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ConnectionState>(initialState);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 5;
  const connectionCheckIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const { devMode } = useDevMode();

  // Add a specific flag for connection check failure to improve debugging
  const connectionCheckFailRef = React.useRef<{
    count: number,
    lastError: any
  }>({
    count: 0,
    lastError: null
  });

  const checkConnection = useCallback(async (silent = false): Promise<boolean> => {
    // In Dev Mode, we should log the attempt but we don't need to wait for a response
    // We'll still try the real connection but won't block UI
    if (devMode) {
      console.log("⚙️ [Dev Mode] Connection check - still trying real connection but won't block UI");
    }

    // Use cache if available and not expired
    const now = Date.now();
    if (now - connectionCache.timestamp < connectionCache.ttl) {
      if (!silent) {
        setState(prev => ({
          ...prev,
          isConnected: connectionCache.isConnected,
          isChecking: false,
          responseTime: connectionCache.responseTime,
          // Only update lastChecked if we're not in silent mode
          ...(connectionCache.isConnected ? { consecutiveErrors: 0 } : {})
        }));
      }
      return connectionCache.isConnected;
    }

    if (state.isChecking && !silent) return state.isConnected;
    
    if (!silent) {
      setState(prev => ({ ...prev, isChecking: true }));
    }
    
    try {
      console.log("🏓 Testing connection with ping request...");
      
      const startTime = Date.now();
      const { data, error } = await executeQuery<any[]>(
        async (signal) => await supabase
          .from('site_settings')
          .select('key')
          .limit(1),
        {
          timeoutMs: 20000, // 20s timeout for reliability
          showErrorToast: false,
          silentRetry: true,
          retries: 1 // Add a retry for connection checks
        }
      );
      
      const responseTime = Date.now() - startTime;
      const isConnected = !error;
      
      // Log details about the connection check
      if (isConnected) {
        console.log(`✅ Connection check succeeded in ${responseTime}ms`);
        connectionCheckFailRef.current.count = 0;
      } else {
        connectionCheckFailRef.current.count++;
        connectionCheckFailRef.current.lastError = error;
        console.error(`❌ Connection check failed (attempt #${connectionCheckFailRef.current.count}):`, error);
      }
      
      // Update the connection cache
      connectionCache.isConnected = isConnected;
      connectionCache.timestamp = now;
      connectionCache.responseTime = responseTime;
      
      if (!silent) {
        setState(prev => ({
          ...prev,
          isConnected,
          isChecking: false,
          lastChecked: new Date(),
          responseTime,
          connectionError: error ? error.message : null,
          reconnecting: false,
          // Reset consecutive errors if connection successful
          consecutiveErrors: isConnected ? 0 : prev.consecutiveErrors + 1
        }));
      
        if (isConnected && state.reconnecting) {
          toast.success("Connection restored", {
            description: `Connected to database (${responseTime}ms)`
          });
          setRetryCount(0);
        } else if (!isConnected) {
          console.error("❓ Connection check failed:", error);
        }
      } else if (!isConnected) {
        // Track consecutive errors even in silent mode
        setState(prev => ({
          ...prev,
          consecutiveErrors: prev.consecutiveErrors + 1
        }));
      }
      
      return isConnected;
    } catch (err) {
      console.error("💔 Error checking connection:", err);
      
      // Update the connection cache for errors too
      connectionCache.isConnected = false;
      connectionCache.timestamp = now;
      connectionCache.responseTime = null;
      
      if (!silent) {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isChecking: false,
          lastChecked: new Date(),
          responseTime: null,
          connectionError: err instanceof Error ? err.message : 'Unknown connection error',
          consecutiveErrors: prev.consecutiveErrors + 1
        }));
      } else {
        setState(prev => ({
          ...prev,
          consecutiveErrors: prev.consecutiveErrors + 1
        }));
      }
      
      return false;
    }
  }, [state.isChecking, state.reconnecting, devMode]);
  
  // Monitor for consecutive connection failures that could indicate RLS recursion issues
  useEffect(() => {
    if (state.consecutiveErrors >= 3) {
      console.error(`❗ Multiple consecutive connection errors (${state.consecutiveErrors}). Possible RLS recursion issue.`);
      // Specific toast for potential RLS recursion issues after multiple failures
      if (state.consecutiveErrors === 3) {
        toast.error("Database connection issues detected", {
          description: "There might be an issue with database permissions. If this persists, try enabling Dev Mode.",
          duration: 8000,
        });
      }
    }
  }, [state.consecutiveErrors]);
  
  const resetConnection = useCallback(async () => {
    // Clear the connection cache
    connectionCache.isConnected = false;
    connectionCache.timestamp = 0;
    
    // Reset state
    setState({
      ...initialState,
      isChecking: true,
      consecutiveErrors: 0
    });
    
    // Check connection
    await checkConnection(false);
    
  }, [checkConnection]);

  const scheduleReconnection = useCallback(() => {
    if (retryCount >= MAX_RETRIES) return;
    
    const reconnectDelay = Math.min(2000 * Math.pow(2, retryCount), 30000); // Exponential backoff
    
    setRetryCount(prev => prev + 1);
    setState(prev => ({ ...prev, reconnecting: true }));
    
    setTimeout(async () => {
      console.log(`🔄 Attempting reconnection ${retryCount + 1}/${MAX_RETRIES}...`);
      const isConnected = await checkConnection(true);
      
      if (isConnected) {
        toast.success("Connection restored", {
          description: "Successfully reconnected to the database"
        });
        setRetryCount(0);
        setState(prev => ({ 
          ...prev, 
          isConnected: true, 
          reconnecting: false,
          lastChecked: new Date(),
          consecutiveErrors: 0 
        }));
      } else if (retryCount < MAX_RETRIES) {
        scheduleReconnection();
      } else {
        toast.error("Connection failed", {
          description: "Couldn't reconnect after multiple attempts. Try enabling Dev Mode or refresh the page."
        });
        setState(prev => ({ ...prev, reconnecting: false }));
      }
    }, reconnectDelay);
  }, [retryCount, checkConnection]);

  // Initial connection check
  useEffect(() => {
    checkConnection();
    
    // Set up periodic connection checks
    connectionCheckIntervalRef.current = setInterval(() => {
      checkConnection(true).then(isConnected => {
        if (!isConnected && !state.reconnecting) {
          console.log("❌ Connection check failed, scheduling reconnection...");
          scheduleReconnection();
        }
      });
    }, 60000); // Check every minute
    
    return () => {
      if (connectionCheckIntervalRef.current) {
        clearInterval(connectionCheckIntervalRef.current);
      }
    };
  }, [checkConnection, scheduleReconnection, state.reconnecting]);

  return (
    <ConnectionContext.Provider value={{ 
      connectionState: state, 
      checkConnection, 
      resetConnection 
    }}>
      {children}
    </ConnectionContext.Provider>
  );
};
