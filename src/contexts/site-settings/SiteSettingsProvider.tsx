
import React, { useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { defaultSettings } from "./defaultSettings";
import { AllSettings } from "./types";
import { SiteSettingsContext, SiteSettingsContextValue } from "./SiteSettingsContext";
import { deepMergeObjects } from "./deepMergeObjects";
import { toast } from "sonner";

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider = ({ children }: SiteSettingsProviderProps) => {
  const [settings, setSettings] = useState<AllSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast: uiToast } = useToast();
  const isInitialLoad = useRef(true);
  const MAX_RETRIES = 3;

  const fetchSettings = useCallback(async (silentMode = false) => {
    try {
      if (!silentMode) {
        setIsLoading(true);
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .timeout(10000); // 10 second timeout

      if (error) {
        console.error("Error fetching settings:", error);
        if (!isInitialLoad.current && !silentMode) {
          uiToast({
            title: "Error",
            description: "Failed to load site settings, using defaults",
            variant: "destructive",
          });
        }
        
        // Handle connection error for retries
        if (error.message?.includes('Failed to fetch') || 
            error.message?.includes('NetworkError') ||
            error.message?.includes('timeout')) {
          setConnectionError(true);
          setRetryCount(prev => prev + 1);
        }
        
        setSettings(defaultSettings);
        if (!silentMode) {
          setIsLoading(false);
        }
        return;
      }

      // Reset error state on successful fetch
      if (connectionError) {
        setConnectionError(false);
        setRetryCount(0);
        if (retryCount > 0 && !silentMode) {
          toast.success("Connection restored", {
            description: "Successfully reconnected to the database."
          });
        }
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
      
      if (!silentMode) {
        uiToast({
          title: "Error",
          description: "Could not load settings, using defaults",
          variant: "destructive",
        });
      }
    } finally {
      if (!silentMode) {
        setIsLoading(false);
        isInitialLoad.current = false;
      }
    }
  }, [uiToast, connectionError, retryCount]);

  // Add auto-retry logic for connection errors
  useEffect(() => {
    if (connectionError && retryCount < MAX_RETRIES) {
      const delay = 5000 * Math.pow(2, retryCount); // Exponential backoff
      console.log(`[SiteSettings] Connection error. Retrying in ${delay/1000} seconds... (${retryCount}/${MAX_RETRIES})`);
      
      if (retryCount > 0) {
        toast.error("Database connection issue", {
          description: `Attempting to reconnect in ${delay/1000} seconds...`,
        });
      }
      
      const timer = setTimeout(() => {
        fetchSettings(false); // Not silent mode for retries
      }, delay);
      
      return () => clearTimeout(timer);
    } else if (connectionError && retryCount >= MAX_RETRIES) {
      console.error("[SiteSettings] Max retry attempts reached. Using default settings.");
      toast.error("Connection failed", {
        description: "Could not connect to the database after multiple attempts. Using default settings.",
      });
    }
  }, [connectionError, retryCount, fetchSettings]);

  const updateSettings = async (key: string, values: any, silentMode: boolean = false) => {
    try {
      console.log(`Updating ${key} settings:`, values);
      const { error } = await supabase.rpc('update_site_settings', {
        setting_key: key,
        setting_value: values,
      });

      if (error) {
        console.error("Error updating settings:", error);
        uiToast({
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
        uiToast({
          title: "Settings updated",
          description: `${key.charAt(0).toUpperCase() + key.slice(1)} settings have been saved`,
        });
      } else {
        console.log("Silent update completed for", key);
      }
    } catch (error) {
      console.error("Exception updating settings:", error);
      uiToast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const refreshSettings = async () => {
    console.log("Refreshing settings...");
    try {
      await fetchSettings(true); // Use silent mode for refresh
    } catch (error) {
      console.error("Error during settings refresh:", error);
    }
  };

  useEffect(() => {
    try {
      fetchSettings(false); // Not silent on initial load
    } catch (error) {
      console.error("Error in settings provider useEffect:", error);
      setIsLoading(false);
    }
  }, [fetchSettings]);

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
