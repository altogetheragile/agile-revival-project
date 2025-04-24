
import { Course, ScheduleCourseFormData } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";

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

export const getCourseTemplates = async (): Promise<Course[]> => {
  const { data: templates, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_template', true);
    
  if (error) {
    console.error("Error fetching course templates:", error);
    return [];
  }
  
  return templates.map(mapDbToCourse);
};

export const getCoursesByTemplateId = async (templateId: string): Promise<Course[]> => {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('template_id', templateId);
    
  if (error) {
    console.error("Error fetching courses by template id:", error);
    return [];
  }
  
  return courses.map(mapDbToCourse);
};

export const createCourseFromTemplate = async (templateId: string, scheduleData: ScheduleCourseFormData): Promise<Course | null> => {
  // First fetch the template
  const { data: template, error: templateError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', templateId)
    .single();
  
  if (templateError || !template) {
    console.error("Error fetching template:", templateError);
    return null;
  }
  
  // Create a new course based on the template
  const newCourse = {
    ...template,
    id: undefined, // Let the database generate a new ID
    dates: scheduleData.dates,
    location: scheduleData.location,
    instructor: scheduleData.instructor,
    spots_available: scheduleData.spotsAvailable,
    status: scheduleData.status || 'draft',
    is_template: false,
    template_id: templateId,
  };
  
  const { data: createdCourse, error: createError } = await supabase
    .from('courses')
    .insert([newCourse])
    .select()
    .single();
    
  if (createError) {
    console.error("Error creating course from template:", createError);
    return null;
  }
  
  return mapDbToCourse(createdCourse);
};
