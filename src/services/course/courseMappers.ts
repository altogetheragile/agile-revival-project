
import { Course, CourseFormData } from '@/types/course';

interface SupabaseCourse {
  id: string;
  title: string;
  description: string;
  dates: string;
  location: string;
  price: string;
  instructor: string;
  image_url?: string;
  category: string;
  skill_level: string;
  format: string;
  duration: string;
  status: string;
  spots_available: number;
  is_template: boolean;
  template_id?: string;
  prerequisites?: string;
  learning_outcomes?: string[];
  materials_included?: string[];
  certification?: string;
  image_aspect_ratio?: string;
  image_size?: number;
  image_layout?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

/**
 * Maps a course from the database format to the application format
 */
export const mapDbToCourse = (dbCourse: SupabaseCourse): Course => {
  // Console log for debugging
  console.log("Mapping DB course to app format:", dbCourse);
  
  return {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description,
    dates: dbCourse.dates,
    location: dbCourse.location,
    price: dbCourse.price,
    instructor: dbCourse.instructor,
    imageUrl: dbCourse.image_url || '',
    category: dbCourse.category,
    skillLevel: dbCourse.skill_level as "beginner" | "intermediate" | "advanced" | "all-levels",
    format: dbCourse.format,
    duration: dbCourse.duration,
    status: dbCourse.status as "draft" | "published",
    spotsAvailable: dbCourse.spots_available,
    isTemplate: dbCourse.is_template,
    templateId: dbCourse.template_id,
    prerequisites: dbCourse.prerequisites,
    learningOutcomes: dbCourse.learning_outcomes || [],
    materials: dbCourse.materials_included?.map((mat, index) => ({
      id: `material-${index}`, // Generate an ID for each material
      fileName: mat,
      fileUrl: '',
      fileType: 'text',
    })) || [],
    imageAspectRatio: dbCourse.image_aspect_ratio || '16/9',
    imageSize: dbCourse.image_size || 100,
    imageLayout: dbCourse.image_layout || 'standard'
    // Removed createdAt and updatedAt as they don't exist in Course interface
  };
};

/**
 * Maps a course from the application format to the database format
 */
export const mapCourseToDb = (course: CourseFormData): Omit<SupabaseCourse, 'id' | 'created_at' | 'updated_at'> => {
  // Console log for debugging
  console.log("Mapping app course to DB format:", course);
  
  return {
    title: course.title,
    description: course.description || '',
    dates: course.dates || '',
    location: course.location || '',
    price: course.price || '0',
    instructor: course.instructor || '',
    image_url: course.imageUrl || '',
    category: course.category || '',
    skill_level: course.skillLevel || '',
    format: course.format || '',
    duration: course.duration || '',
    status: course.status || 'draft',
    spots_available: Number(course.spotsAvailable) || 0,
    is_template: course.isTemplate !== undefined ? course.isTemplate : false,
    template_id: course.templateId,
    prerequisites: course.prerequisites || '',
    learning_outcomes: Array.isArray(course.learningOutcomes) ? course.learningOutcomes : [],
    materials_included: course.materials?.map(material => material.fileName) || [],
    image_aspect_ratio: course.imageAspectRatio || '16/9',
    image_size: course.imageSize || 100,
    image_layout: course.imageLayout || 'standard',
  };
};
