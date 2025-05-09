
import { useEffect, useRef, useState } from 'react';
import { useSiteSettings } from '@/contexts/site-settings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

export const SettingsSync = () => {
  const { refreshSettings } = useSiteSettings();
  const { toast: uiToast } = useToast();
  // Track if this is the first load
  const isInitialLoad = useRef(true);
  // Add state to track connection status
  const [isConnected, setIsConnected] = useState(false);
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
        return;
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
          const isSubscribed = status === 'SUBSCRIBED';
          setIsConnected(isSubscribed);
          
          if (isSubscribed) {
            setReconnectAttempts(0);
            // Successfully connected
            if (reconnectAttempts > 0) {
              toast.success("Database connection restored");
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
    
    toast.error("Database connection lost", {
      description: `Attempting to reconnect in ${delay/1000} seconds...`,
      duration: delay,
    });
    
    reconnectTimeoutRef.current = setTimeout(() => {
      setupRealtimeSubscription();
    }, delay);
  };

  useEffect(() => {
    const cleanup = setupRealtimeSubscription();
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [refreshSettings, uiToast]);

  // Don't render anything
  return null;
};
