
// src/types/course.ts

// Base properties shared by all course-related types
interface CourseBase {
  title: string;
  description: string;
  category: string;
  eventType?: string;
  format?: string;
  skillLevel?: string;
  learningOutcomes?: string[];
  prerequisites?: string | null;
  targetAudience?: string | null;
  imageUrl?: string;
  imageAspectRatio?: string;
  imageSize?: number;
  imageLayout?: string;
  price?: string;
  duration?: string;
}

// Database model with all required fields
export interface Course {
  id: string;
  title: string;
  description: string;
  dates: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  location: string;
  instructor: string;
  price: string;
  category: string;
  eventType?: string;
  format?: string;
  skillLevel?: string;
  spotsAvailable: number;
  imageUrl?: string;
  imageAspectRatio?: string;
  imageSize?: number;
  imageLayout?: string;
  learningOutcomes?: string[];
  prerequisites?: string | null;
  targetAudience?: string | null;
  duration?: string;
  isTemplate?: boolean;
  status?: string;
  templateId?: string | null;
  googleDriveFolderId?: string | null;
  googleDriveFolderUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

// Form data with optional ID (for editing)
export interface CourseFormData {
  id?: string;
  title: string;
  description: string;
  dates: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  location: string;
  instructor: string;
  price: string;
  category: string;
  eventType?: string;
  format?: string;
  skillLevel?: string;
  spotsAvailable: number;
  imageUrl?: string;
  imageAspectRatio?: string;
  imageSize?: number;
  imageLayout?: string;
  learningOutcomes?: string[] | string;
  prerequisites?: string | null;
  targetAudience?: string | null;
  duration?: string;
  isTemplate?: boolean;
  status?: string;
  templateId?: string | null;
  googleDriveFolderId?: string | null;
  googleDriveFolderUrl?: string | null;
  deletedAt?: string | null;
}

// Template specific type
export interface CourseTemplate {
  id: string;
  title: string;
  description: string;
  eventType?: string;
  category?: string;
  price?: string;
  learningOutcomes?: string[];
  prerequisites?: string | null;
  targetAudience?: string | null;
  duration?: string;
  skillLevel?: string;
  format?: string;
  status?: string;
  imageUrl?: string;
  imageAspectRatio?: string;
  imageSize?: number;
  imageLayout?: string;
  spotsAvailable: number;
  isTemplate: boolean;
}

// Simplified form for scheduling from template
export interface ScheduleCourseFormData {
  templateId: string;
  title?: string;
  description?: string;
  dates: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  location: string;
  instructor: string;
  spotsAvailable: number;
  status: string;
  eventType?: string;
  price?: string;
  category?: string;
  isTemplate?: boolean;
}

// Registration form data
export interface RegistrationFormData {
  courseId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  additionalNotes?: string;
}
