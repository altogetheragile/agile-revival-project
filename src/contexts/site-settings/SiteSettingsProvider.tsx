
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
      
      // Check connection first - use the shared connection state
      if (!connectionState.isConnected) {
        // Try to re-establish connection
        await checkConnection();
        
        // If still not connected but this is initial load, use default settings
        if (!connectionState.isConnected && isInitialLoad.current) {
          console.log("Connection check failed on initial load, using default settings");
          setSettings(defaultSettings);
          if (!silentMode) {
            setIsLoading(false);
          }
          isInitialLoad.current = false;
          return;
        }
        
        // For non-initial loads, if disconnected, show warning and use cached settings
        if (!connectionState.isConnected && !isInitialLoad.current) {
          toast.warning("Using cached settings", {
            description: "Unable to connect to the database. Using previously loaded settings."
          });
          if (!silentMode) {
            setIsLoading(false);
          }
          return;
        }
      }
      
      // Use executeQuery helper with 20s timeout (increased from 10s)
      const { data, error } = await executeQuery<SiteSetting[]>(
        async (signal) => await supabase
          .from('site_settings')
          .select('key, value'),
        {
          timeoutMs: 20000, // Increased from 10s to 20s to match our global setting
          errorMessage: "Failed to load site settings",
          retries: silentMode ? 0 : 2, // Increased from 1 to 2 retries
          onError: !silentMode && !isInitialLoad.current ? (err) => {
            uiToast({
              title: "Error",
              description: "Failed to load site settings, using defaults",
              variant: "destructive",
            });
          } : undefined
        }
      );

      if (error || !data) {
        console.error("Error fetching settings:", error);
        
        setRetryCount(prev => prev + 1);
        if (!silentMode) {
          setIsLoading(false);
          if (isInitialLoad.current) {
            isInitialLoad.current = false;
          }
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
      
      // Check connection first - use the shared connection state
      if (!connectionState.isConnected) {
        // Try to re-establish connection
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
      
      // Use our executeQuery helper with increased timeout
      const { error } = await executeQuery<any>(
        async (signal) => await supabase.rpc('update_site_settings', {
          setting_key: key,
          setting_value: values,
        }),
        {
          timeoutMs: 20000, // Increased from 10s to 20s
          errorMessage: `Failed to update ${key} settings`,
          retries: 2,  // Increased from 1 to 2 retries
          onError: !silentMode ? (err) => {
            uiToast({
              title: "Error",
              description: `Failed to update ${key} settings`,
              variant: "destructive",
            });
          } : undefined
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
