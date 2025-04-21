
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
      
      // Add a small delay to ensure component is fully mounted
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Error",
          description: "Failed to load site settings, using defaults",
          variant: "destructive",
        });
        // Continue with default settings
        setSettings(defaultSettings);
        setIsLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const newSettings = { ...defaultSettings };
        
        try {
          data.forEach(setting => {
            if (setting.key in newSettings) {
              const currentValue = newSettings[setting.key];
              const newValue = setting.value;
              
              // Handle merging of nested objects - ensure both are objects before spreading
              if (
                typeof currentValue === 'object' && 
                currentValue !== null &&
                !Array.isArray(currentValue) &&
                typeof newValue === 'object' &&
                newValue !== null &&
                !Array.isArray(newValue)
              ) {
                // Deep merge for nested objects like location and socialMedia
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
          // Continue with defaults if there's an error parsing the settings
        }
      } else {
        console.log("No settings found, using defaults:", defaultSettings);
      }
    } catch (error) {
      console.error("Exception fetching settings:", error);
      // Make sure we set something to avoid undefined errors
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to deep merge objects
  const deepMergeObjects = (target: Record<string, any>, source: Record<string, any>): Record<string, any> => {
    try {
      const output = { ...target };
      
      if (!source || typeof source !== 'object') {
        return output;
      }
      
      for (const key in source) {
        if (
          typeof source[key] === 'object' && 
          source[key] !== null && 
          !Array.isArray(source[key]) &&
          typeof target[key] === 'object' && 
          target[key] !== null &&
          !Array.isArray(target[key])
        ) {
          output[key] = deepMergeObjects(target[key], source[key]);
        } else {
          output[key] = source[key];
        }
      }
      
      return output;
    } catch (error) {
      console.error("Error in deepMergeObjects:", error);
      return target; // Return the original object if there's an error
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
      
      try {
        await refreshSettings(); // Fetch updated settings to ensure consistency
      } catch (refreshError) {
        console.error("Error refreshing settings after update:", refreshError);
      }
      
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
    try {
      await fetchSettings();
    } catch (error) {
      console.error("Error during settings refresh:", error);
      // Don't rethrow to prevent unhandled promise rejection
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
