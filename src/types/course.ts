
// src/types/course.ts

export interface Course {
  id: string;
  title: string;
  description: string;
  dates: string;
  startDate?: string;
  endDate?: string;
  location: string;
  instructor: string;
  price: string;
  category: string;
  eventType?: string; // Changed from courseType to eventType for consistency
  format?: string;
  skillLevel?: string;
  spotsAvailable: number;
  isTemplate: boolean;
  status?: string;
  imageUrl?: string;
  imageSize?: number;
  imageAspectRatio?: string;
  imageLayout?: string;
  learningOutcomes?: string[];
  prerequisites?: string | null;
  targetAudience?: string | null;
  googleDriveFolderId?: string | null;
  googleDriveFolderUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  templateId?: string | null;
  deletedAt?: string | null; // New field for soft deletion
}

// Form data interface
export interface CourseFormData {
  title: string;
  description: string;
  dates: string;
  startDate?: string;
  endDate?: string;
  location: string;
  instructor: string;
  price: string;
  category: string;
  eventType?: string; 
  format?: string;
  skillLevel?: string;
  spotsAvailable: number;
  isTemplate?: boolean;
  status?: string;
  imageUrl?: string;
  imageSize?: number;
  imageAspectRatio?: string;
  imageLayout?: string;
  learningOutcomes?: string[];
  prerequisites?: string;
  targetAudience?: string;
  deletedAt?: string | null; // New field for soft deletion
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

// Course scheduling form data
export interface ScheduleCourseFormData {
  title: string;
  description: string;
  dates: string;
  startDate?: string; 
  endDate?: string;
  location: string;
  instructor: string;
  price: string;
  category: string;
  eventType?: string;
  format?: string;
  skillLevel?: string;
  spotsAvailable: number;
  isTemplate: boolean;
  status: string;
  templateId?: string;
}
