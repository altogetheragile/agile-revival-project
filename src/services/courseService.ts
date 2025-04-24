
import { Course, CourseFormData } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { applyImageSettings } from "./courseImageService";

// Map from database fields to Course type
const mapDbToCourse = (dbCourse: any): Course => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description,
    dates: dbCourse.dates,
    location: dbCourse.location,
    instructor: dbCourse.instructor,
    price: dbCourse.price,
    category: dbCourse.category,
    spotsAvailable: dbCourse.spots_available,
    learningOutcomes: dbCourse.learning_outcomes,
    prerequisites: dbCourse.prerequisites,
    targetAudience: dbCourse.target_audience,
    duration: dbCourse.duration,
    skillLevel: dbCourse.skill_level,
    format: dbCourse.format,
    status: dbCourse.status,
    materials: dbCourse.materials || [],
    googleDriveFolderId: dbCourse.google_drive_folder_id,
    googleDriveFolderUrl: dbCourse.google_drive_folder_url,
    isTemplate: dbCourse.is_template,
    templateId: dbCourse.template_id,
    imageUrl: dbCourse.image_url,
    imageAspectRatio: dbCourse.image_aspect_ratio,
    imageSize: dbCourse.image_size,
    imageLayout: dbCourse.image_layout,
  };
};

// Get all courses
export const getAllCourses = async (): Promise<Course[]> => {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*');
    
  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
  
  return courses.map(mapDbToCourse);
};

// Get courses by category
export const getCoursesByCategory = async (category: string): Promise<Course[]> => {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_template', false);
    
  if (error) {
    console.error("Error fetching courses by category:", error);
    return [];
  }
  
  const mappedCourses = courses.map(mapDbToCourse);
  return category === 'all' ? mappedCourses : mappedCourses.filter(course => course.category === category);
};

// Get a course by ID
export const getCourseById = async (id: string): Promise<Course | undefined> => {
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  if (error) {
    console.error("Error fetching course by id:", error);
    return undefined;
  }
  
  return course ? mapDbToCourse(course) : undefined;
};

// Get all scheduled (non-template) courses
export const getScheduledCourses = async (): Promise<Course[]> => {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_template', false)
    .in('status', ['published', 'draft']);
    
  if (error) {
    console.error("Error fetching scheduled courses:", error);
    return [];
  }
  
  return courses.map(mapDbToCourse);
};

// Get published courses only
export const getPublishedCourses = async (): Promise<Course[]> => {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_template', false)
    .eq('status', 'published');
    
  if (error) {
    console.error("Error fetching published courses:", error);
    return [];
  }
  
  return courses.map(mapDbToCourse);
};

// Map from Course type to database fields
const mapCourseToDb = (courseData: CourseFormData) => {
  return {
    title: courseData.title || "",
    description: courseData.description || "",
    dates: courseData.dates || "",
    location: courseData.location || "",
    instructor: courseData.instructor || "",
    price: courseData.price || "",
    category: courseData.category || "",
    spots_available: courseData.spotsAvailable || 0,
    status: courseData.status || "draft",
    is_template: courseData.isTemplate || false,
    learning_outcomes: Array.isArray(courseData.learningOutcomes) 
      ? courseData.learningOutcomes 
      : courseData.learningOutcomes ? [courseData.learningOutcomes] : [],
    prerequisites: courseData.prerequisites || null,
    target_audience: courseData.targetAudience || null,
    duration: courseData.duration || null,
    skill_level: courseData.skillLevel || null,
    format: courseData.format || "in-person",
    google_drive_folder_id: courseData.googleDriveFolderId || null,
    google_drive_folder_url: courseData.googleDriveFolderUrl || null,
    template_id: courseData.templateId || null,
    image_url: courseData.imageUrl || null,
    image_aspect_ratio: courseData.imageAspectRatio || "16/9",
    image_size: courseData.imageSize !== undefined ? courseData.imageSize : 100,
    image_layout: courseData.imageLayout || "standard"
  };
};

// Create a new course
export const createCourse = async (courseData: CourseFormData): Promise<Course | null> => {
  const newCourse = mapCourseToDb(courseData);
  
  const { data, error } = await supabase
    .from('courses')
    .insert([newCourse])
    .select()
    .single();
    
  if (error) {
    console.error("Error creating course:", error);
    return null;
  }
  
  return mapDbToCourse(data);
};

// Update an existing course
export const updateCourse = async (id: string, courseData: CourseFormData): Promise<Course | null> => {
  const updates = mapCourseToDb(courseData);

  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating course:", error);
    return null;
  }
  
  return mapDbToCourse(data);
};

// Delete a course
export const deleteCourse = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error("Error deleting course:", error);
    return false;
  }
  
  return true;
};

// Re-export course material operations
export { addCourseMaterial, removeCourseMaterial } from './courseMaterialService';

// Re-export template operations
export { 
  getCourseTemplates,
  getCoursesByTemplateId,
  createCourseFromTemplate 
} from './courseTemplateService';
