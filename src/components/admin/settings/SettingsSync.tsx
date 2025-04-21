
import { useEffect } from 'react';
import { useSiteSettings } from '@/contexts/site-settings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const SettingsSync = () => {
  const { refreshSettings } = useSiteSettings();
  const { toast } = useToast();

  useEffect(() => {
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
            toast({
              title: "Settings Updated",
              description: "Settings have been updated from another session",
            });
          } catch (error) {
            console.error("Error refreshing settings:", error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshSettings, toast]);

  return null;
};
