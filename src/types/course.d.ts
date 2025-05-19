
export interface Course {
  id: string;
  title: string;
  description: string;
  dates?: string; // Keeping for backward compatibility
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  location?: string;
  instructor?: string;
  price?: string;
  category?: string;
  category_id?: string;
  skill_level_id?: string;
  eventType?: string;
  event_type_id?: string;
  spotsAvailable: number;
  learningOutcomes?: string[] | string;
  prerequisites?: string;
  targetAudience?: string;
  duration?: string;
  skillLevel?: string;
  format?: string;
  status: "draft" | "published";
  googleDriveFolderId?: string;
  googleDriveFolderUrl?: string;
  isTemplate?: boolean;
  templateId?: string;
  imageUrl?: string;
  imageAspectRatio?: string;
  imageSize?: number;
  imageLayout?: string;
  materials?: any[];
}

export interface CourseFormData extends Omit<Course, 'id'> {
  id?: string;
}

export interface ScheduleCourseFormData {
  templateId: string;
  startDate?: string | Date;
  endDate?: string | Date;
  dates?: string; // Keeping for backward compatibility
  location: string;
  instructor: string;
  spotsAvailable: number;
  status: "draft" | "published";
}
