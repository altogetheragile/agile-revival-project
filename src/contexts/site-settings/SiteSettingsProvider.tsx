
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
import { useDevMode } from "@/contexts/DevModeContext";

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
  const lastUpdateRef = useRef<string | null>(null);
  
  const { connectionState, checkConnection } = useConnection();
  const { devMode } = useDevMode();

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
      
      console.log("Fetching settings from database...");
      
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
        console.log("Received settings data:", data.length, "items");
        
        // Create a new settings object starting with the defaults
        const newSettings: AllSettings = { ...defaultSettings };
        
        try {
          // Process each setting from the database
          data.forEach(setting => {
            console.log(`Processing setting: ${setting.key} =`, setting.value);
            
            // Handle nested settings (with dot notation in key)
            if (setting.key.includes('.')) {
              const [parent, child] = setting.key.split('.');
              if (parent in newSettings && typeof newSettings[parent as keyof AllSettings] === 'object') {
                if (newSettings[parent as keyof AllSettings] === null) {
                  (newSettings[parent as keyof AllSettings] as any) = {};
                }
                (newSettings[parent as keyof AllSettings] as any)[child] = setting.value;
              }
            }
            // Handle direct settings (flat structure)
            else if (setting.key in newSettings && setting.key !== 'courseTemplates') {
              const currentValue = newSettings[setting.key as keyof AllSettings];
              const newValue = setting.value;
              
              // For object values, perform a deep merge
              if (
                typeof currentValue === 'object' && 
                currentValue !== null &&
                !Array.isArray(currentValue) &&
                typeof newValue === 'object' &&
                newValue !== null &&
                !Array.isArray(newValue)
              ) {
                newSettings[setting.key as keyof AllSettings] = deepMergeObjects(
                  currentValue, 
                  newValue
                ) as any;
              } 
              // For array or primitive values, directly replace
              else {
                newSettings[setting.key as keyof AllSettings] = newValue as any;
              }
            }
          });
          
          console.log("Processed settings:", newSettings);
          lastUpdateRef.current = new Date().toISOString();
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
      console.log(`🔄 Attempting to update ${key} settings:`, values, 
        "Connection state:", connectionState.isConnected,
        "Dev Mode:", devMode);
      
      let shouldUpdateLocalState = false;
      let shouldShowSuccess = false;
      
      // Skip actual DB updates if in Dev Mode AND not connected
      // But still update local state to provide a good UX in Dev Mode
      if (devMode && !connectionState.isConnected) {
        console.log("⚙️ Dev Mode active and disconnected - bypassing database update");
        shouldUpdateLocalState = true;
        shouldShowSuccess = true;
        
        if (!silentMode) {
          toast.info("Dev Mode Update", {
            description: `Settings updated locally only (database disconnected)`
          });
        }
      } 
      // Normal path - try to connect to DB if needed
      else {
        // Check connection first if not in Dev Mode
        if (!devMode && !connectionState.isConnected) {
          console.log("📶 Not in Dev Mode and not connected - checking connection");
          // Try to re-establish connection
          await checkConnection();
          
          if (!connectionState.isConnected) {
            console.log("❌ Connection check failed - cannot update settings");
            uiToast({
              title: "Error",
              description: "Cannot update settings: database is not connected",
              variant: "destructive",
            });
            return;
          }
        }
        
        console.log("🚀 Attempting RPC call to update_site_settings");
        
        // Try the RPC update - with explicit error handling
        try {
          // Use executeQuery helper with multiple explicit retries
          const { data, error } = await executeQuery<any>(
            async (signal) => await supabase.rpc('update_site_settings', {
              setting_key: key,
              setting_value: values,
            }),
            {
              timeoutMs: 20000, // Increased from 10s to 20s
              errorMessage: `Failed to update ${key} settings`,
              retries: 0,  // Handle retries manually
              showErrorToast: false // Handle errors manually
            }
          );
          
          if (error) {
            console.error(`❌ Error updating settings:`, error);
            
            // In Dev Mode, still update local state even if RPC fails
            if (devMode) {
              console.log("⚙️ Dev Mode active - updating local state despite RPC error");
              shouldUpdateLocalState = true;
              shouldShowSuccess = true;
              
              if (!silentMode) {
                toast.info("Dev Mode Update", {
                  description: `Settings updated locally only (database error: ${error.message})`
                });
              }
            } else {
              // Normal error handling in non-Dev Mode
              if (!silentMode) {
                uiToast({
                  title: "Error",
                  description: `Failed to update ${key} settings: ${error.message}`,
                  variant: "destructive",
                });
              }
            }
          } else {
            console.log(`✅ Successfully updated ${key} settings in database`);
            shouldUpdateLocalState = true;
            shouldShowSuccess = true;
          }
        } catch (attemptError) {
          console.error(`❌ Exception in updateSettings:`, attemptError);
          
          // In Dev Mode, still update local state even if exception occurs
          if (devMode) {
            console.log("⚙️ Dev Mode active - updating local state despite exception");
            shouldUpdateLocalState = true;
            shouldShowSuccess = true;
            
            if (!silentMode) {
              toast.info("Dev Mode Update", {
                description: `Settings updated locally only (error occurred)`
              });
            }
          } else {
            // Normal error handling in non-Dev Mode
            if (!silentMode) {
              uiToast({
                title: "Error",
                description: "An unexpected error occurred while updating settings",
                variant: "destructive",
              });
            }
          }
        }
      }
      
      // Always update local state in Dev Mode, or if successful in normal mode
      if (shouldUpdateLocalState) {
        console.log(`📝 Updating local state for ${key}:`, values);
        
        // Update local state immediately to reflect changes in the UI
        setSettings(prev => {
          // For nested updates like 'general.siteName', handle differently
          if (key.includes('.')) {
            const [parent, child] = key.split('.');
            return {
              ...prev,
              [parent]: {
                ...prev[parent as keyof AllSettings],
                [child]: values
              }
            };
          }
          
          // For regular top-level settings
          return {
            ...prev,
            [key]: values
          };
        });
        
        // Update last successful update timestamp
        lastUpdateRef.current = new Date().toISOString();
        
        // Show success toast if not in silent mode and should show success
        if (shouldShowSuccess && !silentMode && !isInitialLoad.current) {
          uiToast({
            title: "Settings updated",
            description: `${key.charAt(0).toUpperCase() + key.slice(1)} settings have been ${devMode ? 'saved locally' : 'saved'}`,
          });
        } else {
          console.log("Silent update completed for", key);
        }
      }
    } catch (error) {
      console.error("❌ Uncaught exception in updateSettings:", error);
      
      // Always update local state in Dev Mode, even on uncaught errors
      if (devMode) {
        console.log("⚙️ Dev Mode active - updating local state despite uncaught error");
        
        // Update local state optimistically
        setSettings(prev => {
          if (key.includes('.')) {
            const [parent, child] = key.split('.');
            return {
              ...prev,
              [parent]: {
                ...prev[parent as keyof AllSettings],
                [child]: values
              }
            };
          }
          return { ...prev, [key]: values };
        });
        
        if (!silentMode) {
          toast.info("Dev Mode Update", {
            description: `Settings updated locally only (uncaught error)`
          });
        }
      } else {
        uiToast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
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
      console.log("Initial settings fetch...");
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
    refreshSettings: async () => {
      console.log("Refreshing settings...");
      try {
        await fetchSettings(true); // Use silent mode for refresh
      } catch (error) {
        console.error("Error during settings refresh:", error);
      }
    },
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
