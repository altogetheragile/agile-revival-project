
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
  skillLevels: [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "all-levels", label: "All Levels" },
  ],
  // Add default services text array
  services: [
    {
      icon: "Compass",
      title: "Leadership Coaching",
      description: "Personalized one-on-one coaching to help leaders cultivate an agile mindset and empower self-organizing teams.",
      url: "/services/leadership-coaching"
    },
    {
      icon: "Users",
      title: "Team Coaching",
      description: "Collaborative coaching for agile teams using Scrum, Kanban, or hybrid methods to enhance teamwork and delivery efficiency.",
      url: "/services/team-coaching"
    },
    {
      icon: "Laptop",
      title: "Agile Training",
      description: "Engaging workshops and certification courses on agile methodologies, customized to your organization's unique context.",
      url: "/training-schedule"
    },
    {
      icon: "Activity",
      title: "Agile Facilitation",
      description: "Strategic facilitation of key agile ceremonies, retrospectives, and planning sessions to drive meaningful collaboration.",
      url: "/services/agile-facilitation"
    },
    {
      icon: "BarChart3",
      title: "Performance Metrics",
      description: "Developing insightful measurement approaches that focus on outcomes, continuous improvement, and organizational growth.",
      url: "/services/performance-metrics"
    },
    {
      icon: "Puzzle",
      title: "Custom Coaching Solutions",
      description: "Tailored, flexible coaching programs designed to address your organization's specific challenges and strategic goals.",
      url: "/services/custom-coaching"
    }
  ]
};
