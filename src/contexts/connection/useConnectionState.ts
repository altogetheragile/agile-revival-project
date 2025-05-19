
import { useState, useCallback, useEffect, useRef } from 'react';
import { ConnectionState } from './types';
import { connectionCache, executeConnectionCheck, handleConsecutiveErrors, showConnectionStatusToast } from './connectionUtils';
import { useReconnection } from './useReconnection';
import { useDevMode } from '@/contexts/DevModeContext';

const initialState: ConnectionState = {
  isConnected: false,
  isChecking: true,
  lastChecked: null,
  responseTime: null,
  reconnecting: false,
  connectionError: null,
  consecutiveErrors: 0,
};

export function useConnectionState() {
  const [state, setState] = useState<ConnectionState>(initialState);
  const { devMode } = useDevMode();
  const { scheduleReconnection } = useReconnection();
  const connectionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Add a specific flag for connection check failure to improve debugging
  const connectionCheckFailRef = useRef<{
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
          ...(connectionCache.isConnected ? { consecutiveErrors: 0 } : {})
        }));
      }
      return connectionCache.isConnected;
    }

    if (state.isChecking && !silent) return state.isConnected;
    
    if (!silent) {
      setState(prev => ({ ...prev, isChecking: true }));
    }
    
    const { isConnected, responseTime, error } = await executeConnectionCheck(devMode);
    
    // Update connection failure tracking
    if (isConnected) {
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
        connectionError: error ? (error.message || "Unknown error") : null,
        reconnecting: false,
        consecutiveErrors: isConnected ? 0 : prev.consecutiveErrors + 1
      }));
      
      showConnectionStatusToast(isConnected, state.reconnecting, responseTime);
    } else if (!isConnected) {
      // Track consecutive errors even in silent mode
      setState(prev => ({
        ...prev,
        consecutiveErrors: prev.consecutiveErrors + 1
      }));
    }
    
    return isConnected;
  }, [state.isChecking, state.reconnecting, devMode]);
  
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
  
  // Monitor for consecutive connection failures
  useEffect(() => {
    handleConsecutiveErrors(state.consecutiveErrors);
  }, [state.consecutiveErrors]);
  
  // Setup periodic connection checks
  useEffect(() => {
    checkConnection();
    
    // Set up periodic connection checks
    connectionCheckIntervalRef.current = setInterval(() => {
      checkConnection(true).then(isConnected => {
        if (!isConnected && !state.reconnecting) {
          console.log("❌ Connection check failed, scheduling reconnection...");
          scheduleReconnection(setState, devMode);
        }
      });
    }, 60000); // Check every minute
    
    return () => {
      if (connectionCheckIntervalRef.current) {
        clearInterval(connectionCheckIntervalRef.current);
      }
    };
  }, [checkConnection, scheduleReconnection, state.reconnecting, devMode]);
  
  return {
    state,
    checkConnection,
    resetConnection
  };
}
