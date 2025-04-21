
import { AllSettings } from './types';
import { COURSE_CATEGORIES } from '@/constants/courseCategories';

export const defaultSettings: AllSettings = {
  general: {
    siteName: "AltogetherAgile",
    contactEmail: "al@altogetherAgile.com",
    contactPhone: "07957557549",
    defaultLanguage: "en",
    timezone: "UTC",
    currency: "USD",
    location: {
      address: "",
      city: "London",
      country: "United Kingdom"
    },
    socialMedia: {
      twitter: "",
      linkedin: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      bluesky: ""
    }
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
  },
  courseCategories: COURSE_CATEGORIES,
};
