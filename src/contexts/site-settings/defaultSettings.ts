
import { AllSettings } from './types';

export const defaultSettings: AllSettings = {
  general: {
    siteName: 'Agile Coaching Company',
    tagline: 'Empowering Teams, Transforming Organizations',
    contactEmail: 'info@example.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Agile Street, Innovation City',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    language: 'en-US',
    defaultLanguage: 'en-US',
    location: {
      address: '123 Agile Street',
      city: 'Innovation City',
      country: 'United States'
    },
    socialMedia: {
      twitter: 'https://twitter.com/example',
      facebook: 'https://facebook.com/example',
      linkedin: 'https://linkedin.com/example',
      instagram: 'https://instagram.com/example',
      youtube: 'https://youtube.com/example',
      tiktok: '',
      bluesky: ''
    }
  },
  interface: {
    theme: 'light',
    primaryColor: '#6366f1',
    secondaryColor: '#4f46e5',
    borderRadius: 'md',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    accentColor: '#8b5cf6',
    grayColor: '#6b7280',
    colorScheme: 'light',
    themeMode: 'system',
    animationSpeed: 'fast'
  },
  security: {
    enable2FA: false,
    passwordPolicy: 'medium',
    sessionTimeout: 30,
    allowedIPs: [],
    requirePasswordReset: false,
    passwordResetDays: 90,
    strongPasswords: true,
    twoFactorAuth: false
  },
  users: {
    defaultRole: 'member',
    registrationEnabled: true,
    approvalRequired: false,
    defaultAvatar: '/images/default-avatar.png',
    requireEmailVerification: true,
    allowUserRegistration: true,
    autoApproveUsers: false,
    allowSocialSignIn: true
  },
  social: {
    twitter: 'https://twitter.com/example',
    facebook: 'https://facebook.com/example',
    linkedin: 'https://linkedin.com/example',
    instagram: 'https://instagram.com/example',
    youtube: 'https://youtube.com/example',
    tiktok: '',
    bluesky: ''
  },
  services: {
    mailProvider: 'SMTP',
    smsProvider: 'Twilio',
    analyticsTool: 'Google Analytics',
    paymentGateway: 'Stripe',
    liveChatTool: 'Intercom',
    emailProvider: 'SMTP',
    serviceItems: []
  },
  googleDrive: {
    enabled: false,
    clientId: '',
    clientSecret: '',
    folderId: '',
  },
  courseFilters: {
    categories: [],
    tags: [],
    difficultyLevels: [],
    category: [],
    skillLevel: [],
    format: [],
  },
  templates: {
    syncMode: 'prompt',
  },
  pages: [],
  
  // Add default values for the new properties
  courseFormats: [],
  courseCategories: [],
  eventTypes: [],
  skillLevels: []
};
