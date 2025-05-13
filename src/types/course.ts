
export interface Course {
  id: string;
  title: string;
  description: string;
  dates: string;
  location: string;
  instructor: string;
  price: string;
  eventType: string; // New field to distinguish between different event types
  category: string;
  spotsAvailable: number;
  learningOutcomes?: string[];
  prerequisites?: string;
  targetAudience?: string;
  duration?: string;
  skillLevel?: "beginner" | "intermediate" | "advanced" | "all-levels";
  format?: string;
  status?: "draft" | "published";
  materials?: CourseMaterial[];
  googleDriveFolderId?: string;
  googleDriveFolderUrl?: string;
  isTemplate?: boolean;
  templateId?: string;
  imageUrl?: string;
  imageAspectRatio?: string;
  imageSize?: number;
  imageLayout?: string;
}

export interface CourseMaterial {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  description?: string;
  googleFileId?: string;
}

export type CourseFormData = Omit<Course, "id"> & {
  id?: string;
  learningOutcomes?: string[] | string;
  googleDriveFolderId?: string;
  googleDriveFolderUrl?: string;
  isTemplate?: boolean;
  templateId?: string;
  imageUrl?: string;
  imageAspectRatio?: string;
  imageSize?: number;
  imageLayout?: string;
};

export interface CourseWithFormData extends Omit<Course, "learningOutcomes"> {
  learningOutcomes?: string[] | string;
}

export interface CourseTemplate {
  id: string;
  title: string;
  description: string;
  eventType: string; // New field to distinguish between different event types
  category: string;
  price: string;
  learningOutcomes?: string[];
  prerequisites?: string;
  targetAudience?: string;
  duration?: string;
  skillLevel?: "beginner" | "intermediate" | "advanced" | "all-levels";
  format?: string;
  status?: "draft" | "published";
  imageUrl?: string;
  imageAspectRatio?: string;
  imageSize?: number;
  imageLayout?: string;
}

// For scheduling a course from a template
export interface ScheduleCourseFormData {
  templateId: string;
  dates: string;
  location: string;
  instructor: string;
  spotsAvailable: number;
  status?: "draft" | "published";
}
