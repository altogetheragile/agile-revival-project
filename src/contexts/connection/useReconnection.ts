
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ConnectionState } from './types';
import { executeConnectionCheck, showConnectionStatusToast } from './connectionUtils';

export function useReconnection() {
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 5;
  
  const scheduleReconnection = useCallback(async (
    setState: React.Dispatch<React.SetStateAction<ConnectionState>>,
    devMode: boolean
  ) => {
    if (retryCount >= MAX_RETRIES) return;
    
    const reconnectDelay = Math.min(2000 * Math.pow(2, retryCount), 30000); // Exponential backoff
    
    setRetryCount(prev => prev + 1);
    setState(prev => ({ ...prev, reconnecting: true }));
    
    setTimeout(async () => {
      console.log(`🔄 Attempting reconnection ${retryCount + 1}/${MAX_RETRIES}...`);
      const { isConnected, responseTime, error } = await executeConnectionCheck(devMode);
      
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
        scheduleReconnection(setState, devMode);
      } else {
        toast.error("Connection failed", {
          description: "Couldn't reconnect after multiple attempts. Try enabling Dev Mode or refresh the page."
        });
        setState(prev => ({ ...prev, reconnecting: false }));
      }
    }, reconnectDelay);
  }, [retryCount]);
  
  return {
    retryCount,
    scheduleReconnection
  };
}
