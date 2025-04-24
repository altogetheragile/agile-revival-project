import React, { useState, useEffect, ReactNode, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { defaultSettings } from "./defaultSettings";
import { AllSettings } from "./types";
import { SiteSettingsContext, SiteSettingsContextValue } from "./SiteSettingsContext";
import { deepMergeObjects } from "./deepMergeObjects";

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider = ({ children }: SiteSettingsProviderProps) => {
  const [settings, setSettings] = useState<AllSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isInitialLoad = useRef(true);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) {
        console.error("Error fetching settings:", error);
        if (!isInitialLoad.current) {
          toast({
            title: "Error",
            description: "Failed to load site settings, using defaults",
            variant: "destructive",
          });
        }
        setSettings(defaultSettings);
        setIsLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const newSettings = { ...defaultSettings };
        try {
          data.forEach(setting => {
            if (setting.key in newSettings && setting.key !== 'courseTemplates') {
              const currentValue = newSettings[setting.key];
              const newValue = setting.value;
              if (
                typeof currentValue === 'object' && 
                currentValue !== null &&
                !Array.isArray(currentValue) &&
                typeof newValue === 'object' &&
                newValue !== null &&
                !Array.isArray(newValue)
              ) {
                newSettings[setting.key] = deepMergeObjects(currentValue, newValue);
              } else {
                newSettings[setting.key] = newValue;
              }
            }
          });
          console.log("Fetched settings:", newSettings);
          setSettings(newSettings);
        } catch (parseError) {
          console.error("Error processing settings:", parseError);
        }
      } else {
        console.log("No settings found, using defaults:", defaultSettings);
      }
    } catch (error) {
      console.error("Exception fetching settings:", error);
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
      isInitialLoad.current = false;
    }
  };

  const updateSettings = async (key: string, values: any, silentMode: boolean = false) => {
    try {
      console.log(`Updating ${key} settings:`, values);
      const { error } = await supabase.rpc('update_site_settings', {
        setting_key: key,
        setting_value: values,
      });

      if (error) {
        console.error("Error updating settings:", error);
        toast({
          title: "Error",
          description: `Failed to update ${key} settings: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      setSettings(prev => ({
        ...prev,
        [key]: values
      }));

      if (!silentMode && !isInitialLoad.current) {
        toast({
          title: "Settings updated",
          description: `${key.charAt(0).toUpperCase() + key.slice(1)} settings have been saved`,
        });
      } else {
        console.log("Silent update completed for", key);
      }
    } catch (error) {
      console.error("Exception updating settings:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const refreshSettings = async () => {
    console.log("Refreshing settings...");
    try {
      await fetchSettings();
    } catch (error) {
      console.error("Error during settings refresh:", error);
    }
  };

  useEffect(() => {
    try {
      fetchSettings();
    } catch (error) {
      console.error("Error in settings provider useEffect:", error);
      setIsLoading(false);
    }
  }, []);

  const value: SiteSettingsContextValue = {
    settings,
    isLoading,
    updateSettings,
    refreshSettings,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
