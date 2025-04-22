
import { useEffect, useRef } from 'react';
import { useSiteSettings } from '@/contexts/site-settings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const SettingsSync = () => {
  const { refreshSettings } = useSiteSettings();
  const { toast } = useToast();
  // Add a ref to track if this is the first load
  const isInitialLoad = useRef(true);

  useEffect(() => {
    try {
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
                toast({
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
        .subscribe();

      return () => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error("Error removing channel:", error);
        }
      };
    } catch (error) {
      console.error("Error setting up settings sync:", error);
      return () => {}; // Return empty cleanup function
    }
  }, [refreshSettings, toast]);

  return null;
};
