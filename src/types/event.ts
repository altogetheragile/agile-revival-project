export interface Event {
  id: string;
  title: string;
  description: string;
  dates: string;
  location: string;
  instructor: string;
  price: string;
  category: string;
  eventType: string; // Made this field required
  spotsAvailable: number;
  learningOutcomes?: string[];
  prerequisites?: string;
  targetAudience?: string;
  duration?: string;
  skillLevel?: "beginner" | "intermediate" | "advanced" | "all-levels";
  format?: string;
  status: "draft" | "published";
  materials?: EventMaterial[];
  googleDriveFolderId?: string;
  googleDriveFolderUrl?: string;
  isTemplate?: boolean;
  templateId?: string;
  imageUrl?: string;
  imageAspectRatio?: string;
  imageSize?: number;
  imageLayout?: string;
}

export interface EventMaterial {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  description?: string;
  googleFileId?: string;
}

export type EventFormData = Omit<Event, "id"> & {
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
  eventType: string; // Made this field required
};

export interface EventWithFormData extends Omit<Event, "learningOutcomes"> {
  learningOutcomes?: string[] | string;
}

export interface ScheduleEventFormData {
  templateId: string;
  dates: string;
  location: string;
  instructor: string;
  spotsAvailable: number;
  status: "draft" | "published";
  eventType?: string; // Add eventType field
}
