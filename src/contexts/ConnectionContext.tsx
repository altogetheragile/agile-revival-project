
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { executeQuery } from '@/utils/supabaseHelpers';

interface ConnectionState {
  isConnected: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  responseTime: number | null;
  reconnecting: boolean;
  connectionError: string | null;
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

  const checkConnection = useCallback(async (silent = false): Promise<boolean> => {
    if (state.isChecking && !silent) return state.isConnected;
    
    if (!silent) {
      setState(prev => ({ ...prev, isChecking: true }));
    }
    
    try {
      // Create a controller with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const startTime = Date.now();
      const { data, error } = await executeQuery<any[]>(
        (signal) => supabase
          .from('site_settings')
          .select('key')
          .limit(1)
          .abortSignal(signal),
        {
          timeoutMs: 5000,
          showErrorToast: false,
          silentRetry: true
        }
      );
      
      const responseTime = Date.now() - startTime;
      
      const isConnected = !error;
      
      if (!silent) {
        setState(prev => ({
          ...prev,
          isConnected,
          isChecking: false,
          lastChecked: new Date(),
          responseTime,
          connectionError: error ? error.message : null,
          reconnecting: false
        }));
      
        if (isConnected && state.reconnecting) {
          toast.success("Connection restored", {
            description: `Connected to database (${responseTime}ms)`
          });
          setRetryCount(0);
        } else if (!isConnected) {
          console.error("Connection check failed:", error);
        }
      }
      
      return isConnected;
    } catch (err) {
      console.error("Error checking connection:", err);
      
      if (!silent) {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isChecking: false,
          lastChecked: new Date(),
          responseTime: null,
          connectionError: err instanceof Error ? err.message : 'Unknown connection error',
        }));
      }
      
      return false;
    }
  }, [state.isChecking, state.reconnecting]);
  
  const resetConnection = useCallback(async () => {
    // Reset state
    setState({
      ...initialState,
      isChecking: true
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
      console.log(`Attempting reconnection ${retryCount + 1}/${MAX_RETRIES}...`);
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
          lastChecked: new Date()
        }));
      } else if (retryCount < MAX_RETRIES) {
        scheduleReconnection();
      } else {
        toast.error("Connection failed", {
          description: "Couldn't reconnect after multiple attempts. Please check your connection."
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
          console.log("Connection check failed, scheduling reconnection...");
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
