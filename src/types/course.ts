
export interface Course {
  id: string;
  title: string;
  description: string;
  dates: string;
  location: string;
  instructor: string;
  price: string;
  category: "scrum" | "kanban" | "leadership" | "all";
  spotsAvailable: number;
  learningOutcomes?: string[];
  prerequisites?: string;
  targetAudience?: string;
  duration?: string;
  skillLevel?: "beginner" | "intermediate" | "advanced" | "all-levels";
  format?: "online" | "live" | "in-person" | "hybrid";
  status?: "draft" | "published";
  materials?: CourseMaterial[];
}

export interface CourseMaterial {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  description?: string;
}

export type CourseFormData = Omit<Course, "id" | "materials"> & {
  id?: string;
  learningOutcomes?: string[] | string;
  materials?: File[];
};
