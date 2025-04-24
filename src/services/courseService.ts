
import { Course, CourseFormData } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { applyImageSettings } from "./courseImageService";

// Get all courses
export const getAllCourses = async (): Promise<Course[]> => {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*');
    
  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
  
  return courses;
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
  
  return category === 'all' ? courses : courses.filter(course => course.category === category);
};

// Get a course by ID
export const getCourseById = async (id: string): Promise<Course | undefined> => {
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error("Error fetching course by id:", error);
    return undefined;
  }
  
  return course;
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
  
  return courses;
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
  
  return courses;
};

// Create a new course
export const createCourse = async (courseData: CourseFormData): Promise<Course | null> => {
  const newCourse = {
    title: courseData.title || "",
    description: courseData.description || "",
    dates: courseData.dates || "",
    location: courseData.location || "",
    instructor: courseData.instructor || "",
    price: courseData.price || "",
    category: courseData.category || "",
    spots_available: courseData.spotsAvailable || 0,
    status: courseData.status,
    is_template: courseData.isTemplate || false,
    materials: [],
    learning_outcomes: Array.isArray(courseData.learningOutcomes) 
      ? courseData.learningOutcomes 
      : courseData.learningOutcomes ? [courseData.learningOutcomes] : [],
    prerequisites: courseData.prerequisites,
    target_audience: courseData.targetAudience,
    duration: courseData.duration,
    skill_level: courseData.skillLevel,
    format: courseData.format,
    google_drive_folder_id: courseData.googleDriveFolderId,
    google_drive_folder_url: courseData.googleDriveFolderUrl,
    template_id: courseData.templateId,
    ...applyImageSettings({}, courseData)
  };
  
  const { data, error } = await supabase
    .from('courses')
    .insert([newCourse])
    .select()
    .single();
    
  if (error) {
    console.error("Error creating course:", error);
    return null;
  }
  
  return data;
};

// Update an existing course
export const updateCourse = async (id: string, courseData: CourseFormData): Promise<Course | null> => {
  const updates = {
    title: courseData.title,
    description: courseData.description,
    dates: courseData.dates,
    location: courseData.location,
    instructor: courseData.instructor,
    price: courseData.price,
    category: courseData.category,
    spots_available: courseData.spotsAvailable,
    status: courseData.status,
    is_template: courseData.isTemplate,
    learning_outcomes: Array.isArray(courseData.learningOutcomes) 
      ? courseData.learningOutcomes 
      : courseData.learningOutcomes ? [courseData.learningOutcomes] : undefined,
    prerequisites: courseData.prerequisites,
    target_audience: courseData.targetAudience,
    duration: courseData.duration,
    skill_level: courseData.skillLevel,
    format: courseData.format,
    google_drive_folder_id: courseData.googleDriveFolderId,
    google_drive_folder_url: courseData.googleDriveFolderUrl,
    template_id: courseData.templateId,
    ...applyImageSettings({ imageUrl: undefined }, courseData)
  };

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
  
  return data;
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
