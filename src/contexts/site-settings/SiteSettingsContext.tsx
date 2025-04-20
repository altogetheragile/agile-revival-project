
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { defaultSettings } from "./defaultSettings";
import { AllSettings, SiteSettingsContextType } from "./types";

export const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  updateSettings: async () => {},
  refreshSettings: async () => {},
});

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider = ({ children }: SiteSettingsProviderProps) => {
  const [settings, setSettings] = useState<AllSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Error",
          description: "Failed to load site settings",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        // Start with the default settings to ensure all fields exist
        const newSettings = { ...defaultSettings };
        
        // Update with values from the database
        data.forEach(setting => {
          if (setting.key in newSettings) {
            // Merge objects instead of replacing to preserve default values
            if (typeof newSettings[setting.key] === 'object' && newSettings[setting.key] !== null) {
              newSettings[setting.key] = {
                ...newSettings[setting.key],
                ...setting.value
              };
            } else {
              newSettings[setting.key] = setting.value;
            }
          }
        });
        
        console.log("Fetched settings:", newSettings);
        setSettings(newSettings);
      } else {
        console.log("No settings found, using defaults:", defaultSettings);
      }
    } catch (error) {
      console.error("Exception fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (key: string, values: any) => {
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

      // Update state with the new values for real-time feedback
      setSettings(prev => ({
        ...prev,
        [key]: values
      }));
      
      await refreshSettings(); // Fetch updated settings to ensure consistency
      
      toast({
        title: "Settings updated",
        description: `${key.charAt(0).toUpperCase() + key.slice(1)} settings have been saved`,
      });
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
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const value = {
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
