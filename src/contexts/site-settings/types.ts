
// Types for our various settings
export type GeneralSettings = {
  siteName: string;
  contactEmail: string;
  contactPhone?: string;
  defaultLanguage: string;
  timezone: string;
  currency: string;
  location: {
    address: string;
    city: string;
    country: string;
  };
  socialMedia: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    bluesky?: string;
  };
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

export interface SiteSettingsContextType {
  settings: AllSettings;
  isLoading: boolean;
  updateSettings: (key: string, values: any) => Promise<void>;
  refreshSettings: () => Promise<void>;
}
