
// Types for our various settings
import { CourseTemplate } from "@/types/course";
import { CourseCategoryConfig } from "@/constants/courseCategories";

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

// Page section types
export type PageSection = {
  id: string;
  type: string;
  title: string;
  content: string;
  enabled: boolean;
  settings?: any;
};

// Page structure
export type Page = {
  id: string;
  title: string;
  url: string;
  sections: PageSection[];
};

// Combined settings types
export type AllSettings = {
  general: GeneralSettings;
  interface: InterfaceSettings;
  user: UserSettings;
  security: SecuritySettings;
  courseTemplates?: CourseTemplate[];
  courseCategories?: CourseCategoryConfig[];
  skillLevels?: { value: string; label: string }[];
  services?: any[];
  pages?: Page[];
  [key: string]: any;
};

export interface SiteSettingsContextType {
  settings: AllSettings;
  isLoading: boolean;
  updateSettings: (key: string, values: any, silentMode?: boolean) => Promise<void>;
  refreshSettings: () => Promise<void>;
}
