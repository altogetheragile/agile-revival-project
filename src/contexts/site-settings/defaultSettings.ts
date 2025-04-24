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
  ],
  pages: [
    {
      id: "home",
      title: "Home",
      url: "/",
      sections: [
        {
          id: "hero-section",
          type: "hero",
          title: "Welcome to AltogetherAgile",
          content: "Transform your organization with expert agile coaching and training.",
          enabled: true,
          settings: {
            buttonText: "Get Started",
            buttonLink: "/contact",
            imageUrl: ""
          }
        },
        {
          id: "services-section",
          type: "services",
          title: "Our Services",
          content: "Comprehensive agile coaching and training solutions tailored to your needs.",
          enabled: true
        },
        {
          id: "about-section",
          type: "content",
          title: "About Us",
          content: "AltogetherAgile helps organizations transform through agile coaching, consulting, and training.",
          enabled: true
        },
        {
          id: "testimonials-section",
          type: "testimonials",
          title: "What Our Clients Say",
          content: "Read testimonials from our satisfied clients.",
          enabled: true
        },
        {
          id: "contact-section",
          type: "contact",
          title: "Get in Touch",
          content: "Reach out to us to discuss how we can help you.",
          enabled: true
        }
      ]
    },
    {
      id: "about",
      title: "About Us",
      url: "/about",
      sections: [
        {
          id: "about-hero",
          type: "hero",
          title: "About AltogetherAgile",
          content: "Learn more about our mission and values.",
          enabled: true,
          settings: {
            buttonText: "Contact Us",
            buttonLink: "/contact",
            imageUrl: ""
          }
        },
        {
          id: "about-content",
          type: "content",
          title: "Our Story",
          content: "AltogetherAgile was founded with the mission to help organizations transform through agile methodologies.",
          enabled: true
        }
      ]
    },
    {
      id: "contact",
      title: "Contact",
      url: "/contact",
      sections: [
        {
          id: "contact-form",
          type: "contact",
          title: "Get in Touch",
          content: "Reach out to us for any questions or inquiries.",
          enabled: true
        }
      ]
    }
  ]
};
