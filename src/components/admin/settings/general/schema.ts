
import { z } from "zod";

// Define nested schemas for location and social media
const locationSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

const socialMediaSchema = z.object({
  twitter: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  tiktok: z.string().url().optional().or(z.literal('')),
  bluesky: z.string().url().optional().or(z.literal('')),
});

export const generalFormSchema = z.object({
  siteName: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  contactEmail: z.string().email({ message: "Please enter a valid email address." }),
  contactPhone: z.string().optional(),
  defaultLanguage: z.string(),
  timezone: z.string(),
  currency: z.string(),
  location: locationSchema,
  socialMedia: socialMediaSchema,
});

export type GeneralFormValues = z.infer<typeof generalFormSchema>;

export const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "America/Hawaii", label: "Hawaii Time (HT)" },
  { value: "Pacific/Honolulu", label: "Hawaii-Aleutian Time (HAT)" },
  { value: "America/Phoenix", label: "Arizona (MST)" },
  { value: "Europe/London", label: "British Time (GMT/BST)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Europe/Athens", label: "Eastern European Time (EET)" },
  { value: "Europe/Moscow", label: "Moscow Time (MSK)" },
  { value: "Asia/Dubai", label: "Gulf Time (GT)" },
  { value: "Asia/Shanghai", label: "China Time (CST)" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT)" },
  { value: "Asia/Tokyo", label: "Japan Time (JST)" },
  { value: "Asia/Seoul", label: "Korea Time (KST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  { value: "Australia/Perth", label: "Australian Western Time (AWT)" },
  { value: "Pacific/Auckland", label: "New Zealand Time (NZT)" },
];

export const currencies = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "CAD", label: "Canadian Dollar (CAD)" },
  { value: "AUD", label: "Australian Dollar (AUD)" },
];
