
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

// LocalStorage key for cached settings
const SETTINGS_CACHE_KEY = "site_settings_cache";

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

  // Helper function to load cached settings from localStorage
  const loadCachedSettings = useCallback((): AllSettings | null => {
    try {
      const cachedSettingsJson = localStorage.getItem(SETTINGS_CACHE_KEY);
      if (!cachedSettingsJson) return null;
      
      const cachedSettings = JSON.parse(cachedSettingsJson);
      console.log("📋 Loaded cached settings from localStorage:", cachedSettings);
      return cachedSettings;
    } catch (error) {
      console.error("❌ Error loading cached settings:", error);
      return null;
    }
  }, []);

  // Helper function to save settings to localStorage
  const saveCachedSettings = useCallback((settingsToCache: AllSettings) => {
    try {
      localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settingsToCache));
      console.log("💾 Saved settings to localStorage cache");
    } catch (error) {
      console.error("❌ Error saving settings to cache:", error);
    }
  }, []);

  const fetchSettings = useCallback(async (silentMode = false) => {
    try {
      if (!silentMode) {
        setIsLoading(true);
      }
      
      // First try to load cached settings
      const cachedSettings = loadCachedSettings();
      
      // Check connection first - use the shared connection state
      if (!connectionState.isConnected) {
        // Try to re-establish connection
        await checkConnection();
        
        // If still not connected but this is initial load, use cached or default settings
        if (!connectionState.isConnected && isInitialLoad.current) {
          console.log("Connection check failed on initial load, using cached or default settings");
          
          if (cachedSettings) {
            console.log("📋 Using cached settings for initial load");
            setSettings(cachedSettings);
            toast.info("Using cached settings", { 
              description: "Unable to connect to the database. Using previously saved settings."
            });
          } else {
            console.log("⚠️ No cached settings found, using defaults");
            setSettings(defaultSettings);
          }
          
          if (!silentMode) {
            setIsLoading(false);
          }
          isInitialLoad.current = false;
          return;
        }
        
        // For non-initial loads, if disconnected, show warning and use cached settings
        if (!connectionState.isConnected && !isInitialLoad.current) {
          if (cachedSettings) {
            console.log("📋 Using cached settings (non-initial load, disconnected)");
            setSettings(cachedSettings);
            toast.warning("Using cached settings", {
              description: "Unable to connect to the database. Using previously saved settings."
            });
          } else {
            console.log("⚠️ No cached settings found while disconnected");
            toast.error("Connection issue", {
              description: "Unable to connect to the database and no cached settings found."
            });
          }
          
          if (!silentMode) {
            setIsLoading(false);
          }
          return;
        }
      }
      
      console.log("🔍 Fetching settings from database...");
      
      // Use executeQuery helper with 20s timeout (increased from 10s)
      const { data, error } = await executeQuery<SiteSetting[]>(
        async (signal) => await supabase
          .from('site_settings')
          .select('key, value'),
        {
          timeoutMs: 20000, // 20 seconds timeout
          errorMessage: "Failed to load site settings",
          retries: silentMode ? 0 : 2,
          onError: !silentMode && !isInitialLoad.current ? (err) => {
            console.error("💔 Error loading settings:", err);
            
            // If we have cached settings, use them as fallback
            const cachedFallback = loadCachedSettings();
            if (cachedFallback) {
              setSettings(cachedFallback);
              uiToast({
                title: "Using cached settings",
                description: "Failed to load settings from database, using cached version",
              });
            } else {
              uiToast({
                title: "Error",
                description: "Failed to load site settings, using defaults",
                variant: "destructive",
              });
            }
          } : undefined
        }
      );

      if (error || !data) {
        console.error("❌ Error fetching settings:", error);
        
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
        console.log("✅ Received settings data:", data.length, "items");
        
        // Create a new settings object starting with the defaults
        const newSettings: AllSettings = { ...defaultSettings };
        
        try {
          // Process each setting from the database
          data.forEach(setting => {
            console.log(`🔄 Processing setting: ${setting.key} =`, setting.value);
            
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
          
          console.log("🎯 Processed settings:", newSettings);
          lastUpdateRef.current = new Date().toISOString();
          setSettings(newSettings);
          
          // Save to cache for offline/fallback use
          saveCachedSettings(newSettings);
          
        } catch (parseError) {
          console.error("❌ Error processing settings:", parseError);
        }
      } else {
        console.log("⚠️ No settings found, using defaults:", defaultSettings);
      }
    } catch (error) {
      console.error("❌ Exception fetching settings:", error);
      
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
  }, [uiToast, retryCount, connectionState, checkConnection, loadCachedSettings, saveCachedSettings]);

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
      
      // Always update local state and cache first for responsive UX
      setSettings(prev => {
        // For nested updates like 'general.siteName', handle differently
        let updatedSettings: AllSettings;
        if (key.includes('.')) {
          const [parent, child] = key.split('.');
          updatedSettings = {
            ...prev,
            [parent]: {
              ...prev[parent as keyof AllSettings],
              [child]: values
            }
          };
        } else {
          // For regular top-level settings
          updatedSettings = {
            ...prev,
            [key]: values
          };
        }
        
        // Cache the updated settings immediately
        saveCachedSettings(updatedSettings);
        return updatedSettings;
      });
      
      let shouldShowSuccess = true;
      
      // Skip database updates entirely if in Dev Mode AND not connected
      if (devMode && !connectionState.isConnected) {
        console.log("⚙️ Dev Mode active and disconnected - skipping database update");
        
        if (!silentMode) {
          toast.info("Dev Mode Update", {
            description: `Settings saved locally. Changes will persist until page refresh but won't be stored in database.`
          });
        }
        
        // Early return after local state update
        lastUpdateRef.current = new Date().toISOString();
        return;
      }
      
      // For all other cases, try to connect if needed
      if (!connectionState.isConnected) {
        console.log("📶 Not connected - checking connection");
        // Try to re-establish connection
        await checkConnection();
      }
      
      // Only proceed with database operation if connected
      if (connectionState.isConnected) {
        console.log("🚀 Attempting RPC call to update_site_settings");
        
        // Try the RPC update with explicit error handling
        try {
          const { data, error } = await executeQuery<any>(
            async (signal) => await supabase.rpc('update_site_settings', {
              setting_key: key,
              setting_value: values,
            }),
            {
              timeoutMs: 20000,
              errorMessage: `Failed to update ${key} settings in database`,
              retries: 1,
              showErrorToast: false
            }
          );
          
          if (error) {
            console.error(`❌ Error updating settings in database:`, error);
            
            if (devMode) {
              // In Dev Mode, we already updated local state, so just show a warning
              toast.warning("Settings saved locally only", {
                description: `Database update failed but settings saved locally. Error: ${error.message}`
              });
            } else {
              // In normal mode, alert the user more strongly
              toast.error("Settings not saved to database", {
                description: `Local changes made but not saved to database. Error: ${error.message}`
              });
            }
            
            // Still update last update timestamp
            lastUpdateRef.current = new Date().toISOString();
            return;
          } else {
            console.log(`✅ Successfully updated ${key} settings in database`);
            // Update last update timestamp for successful DB update
            lastUpdateRef.current = new Date().toISOString();
          }
        } catch (attemptError) {
          console.error(`❌ Exception in updateSettings:`, attemptError);
          
          if (!silentMode) {
            toast.error("Database error", {
              description: "An unexpected error occurred while updating settings in database"
            });
          }
        }
      } else {
        // We're not connected, but we already updated local state
        console.log("❌ Not connected to database - settings saved locally only");
        
        if (!silentMode) {
          toast.warning("Settings saved locally only", {
            description: "Could not connect to database. Changes will be lost on page refresh."
          });
        }
      }
      
      // Show success toast if not in silent mode and should show success
      if (shouldShowSuccess && !silentMode && !isInitialLoad.current) {
        let saveMessage = "Settings have been updated";
        
        if (devMode && !connectionState.isConnected) {
          saveMessage = "Settings saved locally (Dev Mode)";
        } else if (!connectionState.isConnected) {
          saveMessage = "Settings saved locally only";
        }
        
        uiToast({
          title: "Settings updated",
          description: `${key.charAt(0).toUpperCase() + key.slice(1)} ${saveMessage}`,
        });
      } else {
        console.log("Silent update completed for", key);
      }
    } catch (error) {
      console.error("❌ Uncaught exception in updateSettings:", error);
      
      uiToast({
        title: "Error",
        description: "An unexpected error occurred while saving settings",
        variant: "destructive",
      });
    }
  };

  const refreshSettings = async () => {
    console.log("🔄 Refreshing settings...");
    try {
      await fetchSettings(true); // Use silent mode for refresh
    } catch (error) {
      console.error("❌ Error during settings refresh:", error);
    }
  };

  useEffect(() => {
    try {
      console.log("🚀 Initial settings fetch...");
      fetchSettings(false); // Not silent on initial load
    } catch (error) {
      console.error("❌ Error in settings provider useEffect:", error);
      setIsLoading(false);
    }
  }, [fetchSettings]);

  const value: SiteSettingsContextValue = {
    settings,
    isLoading,
    updateSettings,
    refreshSettings: async () => {
      console.log("🔄 Refreshing settings...");
      try {
        await fetchSettings(true); // Use silent mode for refresh
      } catch (error) {
        console.error("❌ Error during settings refresh:", error);
      }
    },
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
