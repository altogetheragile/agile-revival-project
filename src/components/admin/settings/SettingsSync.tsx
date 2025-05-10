
import { useEffect, useRef, useState } from 'react';
import { useSiteSettings } from '@/contexts/site-settings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { useConnection } from '@/contexts/ConnectionContext';

export const SettingsSync = () => {
  const { refreshSettings } = useSiteSettings();
  const { toast: uiToast } = useToast();
  const { connectionState } = useConnection();
  
  // Track if this is the first load
  const isInitialLoad = useRef(true);
  // Add state to track connection status
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setupRealtimeSubscription = async () => {
    try {
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error("Maximum reconnection attempts reached");
        toast.error("Database connection issue", {
          description: "Unable to establish a stable connection to the database."
        });
        return () => {}; // Return empty cleanup function to avoid errors
      }

      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'site_settings'
          },
          async (payload) => {
            console.log('Settings changed:', payload);
            try {
              await refreshSettings();
              
              // Only show toast if it's not the initial page load
              if (!isInitialLoad.current) {
                uiToast({
                  title: "Settings Updated",
                  description: "Settings have been updated from another session",
                });
              } else {
                console.log("Skipping initial settings update toast");
                // After first update, mark initialization as complete
                isInitialLoad.current = false;
              }
            } catch (error) {
              console.error("Error refreshing settings:", error);
              // Don't show error toast to user as it's a background process
            }
          }
        )
        .subscribe((status) => {
          console.log("Realtime subscription status:", status);
          
          if (status === 'SUBSCRIBED') {
            setReconnectAttempts(0);
            // Successfully connected
            if (reconnectAttempts > 0) {
              toast.success("Realtime connection restored");
            }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            // Handle connection error
            console.error(`Supabase channel error: ${status}`);
            handleReconnect();
          }
        });

      return () => {
        try {
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          supabase.removeChannel(channel);
        } catch (error) {
          console.error("Error removing channel:", error);
        }
      };
    } catch (error) {
      console.error("Error setting up settings sync:", error);
      handleReconnect();
      return () => {}; // Return empty cleanup function
    }
  };
  
  const handleReconnect = () => {
    setReconnectAttempts(prev => prev + 1);
    
    // Clear any existing timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    // Exponential backoff for reconnection
    const delay = Math.min(1000 * (2 ** reconnectAttempts), 30000);
    
    toast.error("Realtime connection lost", {
      description: `Attempting to reconnect in ${delay/1000} seconds...`,
      duration: delay,
    });
    
    reconnectTimeoutRef.current = setTimeout(() => {
      // First check if the database is connected
      if (!connectionState.isConnected) {
        console.log("Database not connected, skipping realtime reconnection attempt");
        // Try again in a bit
        handleReconnect();
        return;
      }
      
      console.log("Attempting to reconnect realtime subscription...");
      const cleanup = setupRealtimeSubscription();
      // Store the cleanup function if needed
      if (cleanup instanceof Promise) {
        cleanup.then(cleanupFn => {
          // Store for later if needed
        }).catch(error => {
          console.error("Error getting cleanup function:", error);
        });
      }
    }, delay);
  };

  useEffect(() => {
    // Only set up realtime if database is connected
    if (!connectionState.isConnected) {
      console.log("Database not connected, waiting to set up realtime...");
      return;
    }
    
    console.log("Setting up realtime subscription for settings...");
    let cleanupFunction: (() => void) | undefined;
    
    // Set up the subscription and handle the Promise
    setupRealtimeSubscription()
      .then(cleanup => {
        cleanupFunction = cleanup;
      })
      .catch(error => {
        console.error("Failed to set up realtime subscription:", error);
      });
    
    // Return a cleanup function for useEffect
    return () => {
      if (cleanupFunction) {
        cleanupFunction();
      }
      
      // Also clear any reconnect timeout if component unmounts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [refreshSettings, uiToast, connectionState.isConnected]);

  // Don't render anything
  return null;
};
