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
  },
  interface: {
    colorScheme: 'light',
    borderRadius: '0.5rem',
    fontFamily: 'Inter, sans-serif',
    animationSpeed: 'fast',
    themeMode: 'system',
  },
  security: {
    enable2FA: false,
    passwordPolicy: 'medium',
    sessionTimeout: 30,
    allowedIPs: [],
  },
  users: {
    defaultRole: 'member',
    requireEmailVerification: true,
    allowSelfRegistration: true,
  },
  social: {
    twitter: 'https://twitter.com/example',
    facebook: 'https://facebook.com/example',
    linkedin: 'https://linkedin.com/example',
    instagram: 'https://instagram.com/example',
  },
  services: {
    emailProvider: 'SMTP',
    smsProvider: 'Twilio',
    analyticsProvider: 'Google Analytics',
    paymentGateway: 'Stripe',
  },
  googleDrive: {
    enabled: false,
    folderId: '',
  },
  courseFilters: {
    category: [],
    skillLevel: [],
    format: [],
  },
  templates: {
    syncMode: 'prompt',
  }
};
