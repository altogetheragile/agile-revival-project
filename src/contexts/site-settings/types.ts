
export interface GeneralSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  language: string;
  defaultLanguage?: string;
  location?: {
    address: string;
    city: string;
    country: string;
  };
  socialMedia?: {
    twitter: string;
    facebook: string;
    linkedin: string;
    instagram: string;
    youtube: string;
    tiktok?: string;
    bluesky?: string;
  };
}

export interface InterfaceSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  fontFamily: string;
  fontSize: string;
  accentColor: string;
  grayColor: string;
  colorScheme?: string;
  themeMode?: string;
  animationSpeed?: string;
  logoUrl?: string;
  faviconUrl?: string;
  homepageLayout?: string;
  navigationStyle?: string;
}

export interface SecuritySettings {
  enable2FA: boolean;
  passwordPolicy: string;
  sessionTimeout: number;
  allowedIPs: string[];
  requirePasswordReset?: boolean;
  passwordResetDays?: number;
  strongPasswords?: boolean;
  twoFactorAuth?: boolean;
}

export interface UserSettings {
  defaultRole: string;
  registrationEnabled: boolean;
  approvalRequired: boolean;
  defaultAvatar: string;
  allowSocialSignIn?: boolean;
  requireEmailVerification?: boolean;
  allowUserRegistration?: boolean;
  autoApproveUsers?: boolean;
}

export interface SocialMediaSettings {
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok?: string;
  bluesky?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  url: string;
}

export interface ServicesSettings {
  mailProvider: string;
  smsProvider: string;
  paymentGateway: string;
  analyticsTool: string;
  liveChatTool: string;
  emailProvider?: string;
  serviceItems?: ServiceItem[];
}

export interface GoogleDriveSettings {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  folderId: string;
}

export interface CourseFilterSettings {
  categories: string[];
  tags: string[];
  difficultyLevels: string[];
  category?: string[];
  skillLevel?: string[];
  format?: string[];
}

export interface TemplateSettings {
  syncMode?: 'always' | 'prompt' | 'never';
}

export interface PageSettings {
  id: string;
  title: string;
  url: string;
  sections: any[];
}

// Add new interfaces for the additional settings
export interface CourseFormatSettings {
  courseFormats?: Array<{
    value: string;
    label: string;
  }>;
}

export interface CategorySettings {
  courseCategories?: Array<{
    value: string;
    label: string;
  }>;
}

export interface EventTypeSettings {
  eventTypes?: Array<{
    value: string;
    label: string;
  }>;
}

export interface SkillLevelSettings {
  skillLevels?: Array<{
    value: string;
    label: string;
  }>;
}

export interface AllSettings {
  general: GeneralSettings;
  interface: InterfaceSettings;
  security: SecuritySettings;
  users: UserSettings;
  social: SocialMediaSettings;
  services: ServicesSettings;
  googleDrive: GoogleDriveSettings;
  courseFilters: CourseFilterSettings;
  templates: TemplateSettings;
  pages?: PageSettings[];
  
  // Add direct access to the new settings (flat structure)
  courseFormats?: Array<{ value: string; label: string; }>;
  courseCategories?: Array<{ value: string; label: string; }>;
  eventTypes?: Array<{ value: string; label: string; }>;
  skillLevels?: Array<{ value: string; label: string; }>;
}
