import React, { useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { defaultSettings } from "./defaultSettings";
import { AllSettings } from "./types";
import { SiteSettingsContext, SiteSettingsContextValue } from "./SiteSettingsContext";
import { deepMergeObjects } from "./deepMergeObjects";
import { toast } from "sonner";
import { useConnection } from "@/contexts/ConnectionContext";
import { executeQuery } from "@/utils/supabase/query";

interface SiteSettingsProviderProps {
  children: ReactNode;
}

interface SiteSetting {
  key: string;
  value: any;
}

export const SiteSettingsProvider = ({ children }: SiteSettingsProviderProps) => {
  const [settings, setSettings] = useState<AllSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { toast: uiToast } = useToast();
  const isInitialLoad = useRef(true);
  const MAX_RETRIES = 3;
  
  const { connectionState, checkConnection } = useConnection();

  const fetchSettings = useCallback(async (silentMode = false) => {
    try {
      if (!silentMode) {
        setIsLoading(true);
      }
      
      // Check connection first
      if (!connectionState.isConnected) {
        await checkConnection();
        if (!connectionState.isConnected) {
          console.log("Connection check failed, using default settings");
          setSettings(defaultSettings);
          if (!silentMode) {
            setIsLoading(false);
          }
          return;
        }
      }
      
      // Use our new executeQuery helper with the correct type annotation
      const { data, error } = await executeQuery<SiteSetting[]>(
        (signal) => supabase
          .from('site_settings')
          .select('key, value')
          .abortSignal(signal),
        {
          timeoutMs: 10000,
          showErrorToast: !silentMode && !isInitialLoad.current,
          errorMessage: "Failed to load site settings",
          retries: silentMode ? 0 : 1
        }
      );

      if (error || !data) {
        console.error("Error fetching settings:", error);
        
        // Set default settings and show toast if needed
        setSettings(defaultSettings);
        if (!isInitialLoad.current && !silentMode) {
          uiToast({
            title: "Error",
            description: "Failed to load site settings, using defaults",
            variant: "destructive",
          });
        }
        
        setRetryCount(prev => prev + 1);
        if (!silentMode) {
          setIsLoading(false);
        }
        return;
      }

      // Reset retry count on successful fetch
      if (retryCount > 0) {
        setRetryCount(0);
        if (!silentMode) {
          toast.success("Connection restored", {
            description: "Successfully loaded site settings."
          });
        }
      }

      if (data && data.length > 0) {
        const newSettings = { ...defaultSettings };
        try {
          data.forEach(setting => {
            if (setting.key in newSettings && setting.key !== 'courseTemplates') {
              const currentValue = newSettings[setting.key as keyof AllSettings];
              const newValue = setting.value;
              if (
                typeof currentValue === 'object' && 
                currentValue !== null &&
                !Array.isArray(currentValue) &&
                typeof newValue === 'object' &&
                newValue !== null &&
                !Array.isArray(newValue)
              ) {
                newSettings[setting.key as keyof AllSettings] = deepMergeObjects(currentValue, newValue);
              } else {
                newSettings[setting.key as keyof AllSettings] = newValue;
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
  }, [uiToast, retryCount, connectionState, checkConnection]);

  useEffect(() => {
    if (retryCount > 0 && retryCount < MAX_RETRIES) {
      const delay = 5000 * Math.pow(2, retryCount - 1); // Exponential backoff
      console.log(`[SiteSettings] Retry ${retryCount}/${MAX_RETRIES} in ${delay/1000} seconds...`);
      
      if (retryCount > 1) {
        toast.error("Database connection issue", {
          description: `Attempting to reconnect in ${delay/1000} seconds...`,
        });
      }
      
      const timer = setTimeout(() => {
        fetchSettings(false); // Not silent mode for retries
      }, delay);
      
      return () => clearTimeout(timer);
    } else if (retryCount >= MAX_RETRIES) {
      console.error("[SiteSettings] Max retry attempts reached. Using default settings.");
      toast.error("Connection failed", {
        description: "Could not connect to the database after multiple attempts. Using default settings.",
      });
    }
  }, [retryCount, fetchSettings]);

  const updateSettings = async (key: string, values: any, silentMode: boolean = false) => {
    try {
      console.log(`Updating ${key} settings:`, values);
      
      // Check connection first
      if (!connectionState.isConnected) {
        await checkConnection();
        if (!connectionState.isConnected) {
          uiToast({
            title: "Error",
            description: "Cannot update settings: database is not connected",
            variant: "destructive",
          });
          return;
        }
      }
      
      const { error } = await executeQuery<any>(
        (signal) => supabase.rpc('update_site_settings', {
          setting_key: key,
          setting_value: values,
        }).abortSignal(signal),
        {
          timeoutMs: 10000,
          showErrorToast: !silentMode,
          errorMessage: `Failed to update ${key} settings`,
          retries: 1
        }
      );

      if (error) {
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
