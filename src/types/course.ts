
// This file is kept for backward compatibility
// All types are now defined in course.d.ts
export * from './course.d';

// Import with alias to avoid naming conflicts
import type { Course as CourseType } from './course.d';

// Types that are only needed for runtime logic and not exported from course.d.ts
export interface CourseMaterial {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  description?: string;
  googleFileId?: string;
}

// This type is for backward compatibility
export interface CourseWithFormData extends Omit<CourseType, "learningOutcomes"> {
  learningOutcomes?: string[] | string;
}
