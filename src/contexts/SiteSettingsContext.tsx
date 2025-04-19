
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Types for our various settings
export type GeneralSettings = {
  siteName: string;
  contactEmail: string;
  contactPhone?: string;
  defaultLanguage: string;
  timezone: string;
  currency: string;
};

export type InterfaceSettings = {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  homepageLayout: string;
  navigationStyle: string;
};

export type UserSettings = {
  defaultRole: string;
  allowSocialSignIn: boolean;
  requireEmailVerification: boolean;
  allowUserRegistration: boolean;
  autoApproveUsers: boolean;
};

export type SecuritySettings = {
  sessionTimeout: number;
  requirePasswordReset: boolean;
  passwordResetDays?: number;
  twoFactorAuth: boolean;
  strongPasswords: boolean;
};

// Combined settings types
export type AllSettings = {
  general: GeneralSettings;
  interface: InterfaceSettings;
  user: UserSettings;
  security: SecuritySettings;
  [key: string]: any;
};

interface SiteSettingsContextType {
  settings: AllSettings;
  isLoading: boolean;
  updateSettings: (key: string, values: any) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: AllSettings = {
  general: {
    siteName: "AltogetherAgile",
    contactEmail: "contact@altogetheragile.com",
    contactPhone: "+1 (555) 123-4567",
    defaultLanguage: "en",
    timezone: "UTC",
    currency: "USD",
  },
  interface: {
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "#8B5CF6",
    secondaryColor: "#F3E8FF",
    homepageLayout: "featured",
    navigationStyle: "standard",
  },
  user: {
    defaultRole: "user",
    allowSocialSignIn: true,
    requireEmailVerification: true,
    allowUserRegistration: true,
    autoApproveUsers: false,
  },
  security: {
    sessionTimeout: 60,
    requirePasswordReset: false,
    passwordResetDays: 90,
    twoFactorAuth: false,
    strongPasswords: true,
  }
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  updateSettings: async () => {},
  refreshSettings: async () => {},
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider = ({ children }: SiteSettingsProviderProps) => {
  const [settings, setSettings] = useState<AllSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Function to fetch settings from Supabase
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

      // If we have data, update our local state
      if (data && data.length > 0) {
        const newSettings = { ...defaultSettings };
        data.forEach(setting => {
          newSettings[setting.key] = setting.value;
        });
        setSettings(newSettings);
      }
    } catch (error) {
      console.error("Exception fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update a setting category
  const updateSettings = async (key: string, values: any) => {
    try {
      const { error } = await supabase.rpc('update_site_settings', {
        setting_key: key,
        setting_value: values,
      });

      if (error) {
        console.error("Error updating settings:", error);
        toast({
          title: "Error",
          description: "Failed to update settings",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setSettings(prev => ({
        ...prev,
        [key]: values
      }));

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

  // Function to refresh settings
  const refreshSettings = async () => {
    await fetchSettings();
  };

  // Load settings on component mount
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
