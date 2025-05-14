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
}

export interface SecuritySettings {
  enable2FA: boolean;
  passwordPolicy: string;
  sessionTimeout: number;
  allowedIPs: string[];
}

export interface UserSettings {
  defaultRole: string;
  registrationEnabled: boolean;
  approvalRequired: boolean;
  defaultAvatar: string;
}

export interface SocialMediaSettings {
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export interface ServicesSettings {
  mailProvider: string;
  smsProvider: string;
  paymentGateway: string;
  analyticsTool: string;
  liveChatTool: string;
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
}

export interface TemplateSettings {
  syncMode?: 'always' | 'prompt' | 'never';
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
}
