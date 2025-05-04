import { supabase } from '@/integrations/supabase/client';
import { Course, CourseFormData, ScheduleCourseFormData } from '@/types/course';
import { mapDbToCourse } from './course/courseMappers';
import { toast } from 'sonner';
import { createCourseFromTemplate } from './templates/templateMutations';
import { getScheduledCourses } from './course/courseQueries';

// Get all courses
export const getAllCourses = async (): Promise<Course[]> => {
  console.log("Fetching all courses...");
  try {
    // This should get courses that are not templates
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_template', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} courses`);
    if (!data || data.length === 0) {
      console.log("No courses loaded or empty array returned");
      return [];
    }

    return data.map(mapDbToCourse);
  } catch (error) {
    console.error("Unexpected error fetching courses:", error);
    throw error;
  }
};

// Get templates only
export const getCourseTemplates = async (): Promise<Course[]> => {
  console.log("Fetching course templates...");
  try {
    // Check if user is authenticated before making the request
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("No active session found");
      throw new Error("Authentication required to access templates");
    }
    
    console.log(`Making request with authenticated user: ${session.user.id}`);
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_template', true)
      .order('title');

    if (error) {
      console.error("Error fetching course templates:", error);
      // Check if this is a permissions issue
      if (error.message.includes('permission') || error.code === 'PGRST301') {
        throw new Error("You don't have permission to access course templates");
      }
      throw error;
    }

    if (!data || data.length === 0) {
      console.log("No course templates found");
      return [];
    }

    console.log(`Successfully fetched ${data.length} course templates`);
    return data.map(mapDbToCourse);
  } catch (error) {
    console.error("Unexpected error fetching course templates:", error);
    throw error;
  }
};

// Create a new course
export const createCourse = async (courseData: CourseFormData): Promise<boolean> => {
  try {
    console.log("Creating course with data:", courseData);
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("No active session found");
      toast.error("Authentication required", {
        description: "You must be logged in to create a course"
      });
      return false;
    }
    
    // Prepare the data for insertion, converting to snake_case for DB
    const dbCourseData = {
      title: courseData.title,
      description: courseData.description,
      dates: courseData.dates,
      location: courseData.location,
      instructor: courseData.instructor,
      price: courseData.price,
      category: courseData.category,
      spots_available: courseData.spotsAvailable,
      is_template: courseData.isTemplate || false,
      learning_outcomes: courseData.learningOutcomes || [],
      prerequisites: courseData.prerequisites,
      target_audience: courseData.targetAudience,
      duration: courseData.duration,
      skill_level: courseData.skillLevel,
      format: courseData.format,
      status: courseData.status || 'draft',
      image_url: courseData.imageUrl,
      image_aspect_ratio: courseData.imageAspectRatio || '16/9',
      image_size: courseData.imageSize || 100,
      image_layout: courseData.imageLayout || 'standard',
      google_drive_folder_id: courseData.googleDriveFolderId,
      google_drive_folder_url: courseData.googleDriveFolderUrl,
      created_by: session.user.id // Always set the creator to the current user
    };
    
    console.log("Prepared DB data:", dbCourseData);

    const { data, error } = await supabase
      .from('courses')
      .insert([dbCourseData])
      .select();

    if (error) {
      console.error("Error creating course:", error);
      
      // Check for specific errors
      if (error.code === '42501') {
        throw new Error("Permission denied: You don't have access to create courses");
      }
      throw error;
    }

    console.log("Course created successfully:", data);
    return true;
  } catch (error: any) {
    console.error("Failed to create course:", error);
    throw error;
  }
};

// Get course by ID
export const getCourseById = async (id: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching course with ID ${id}:`, error);
      throw error;
    }

    if (!data) {
      console.log(`No course found with ID ${id}`);
      return null;
    }

    return mapDbToCourse(data);
  } catch (error) {
    console.error(`Unexpected error fetching course with ID ${id}:`, error);
    throw error;
  }
};

// Update a course
export const updateCourse = async (id: string, courseData: CourseFormData): Promise<boolean> => {
  try {
    console.log(`Updating course with ID ${id}:`, courseData);
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("No active session found");
      toast.error("Authentication required", {
        description: "You must be logged in to update a course"
      });
      return false;
    }

    // Prepare the data for update, converting to snake_case for DB
    const dbCourseData = {
      title: courseData.title,
      description: courseData.description,
      dates: courseData.dates,
      location: courseData.location,
      instructor: courseData.instructor,
      price: courseData.price,
      category: courseData.category,
      spots_available: courseData.spotsAvailable,
      is_template: courseData.isTemplate,
      learning_outcomes: courseData.learningOutcomes || [],
      prerequisites: courseData.prerequisites,
      target_audience: courseData.targetAudience,
      duration: courseData.duration,
      skill_level: courseData.skillLevel,
      format: courseData.format,
      status: courseData.status,
      image_url: courseData.imageUrl,
      image_aspect_ratio: courseData.imageAspectRatio,
      image_size: courseData.imageSize,
      image_layout: courseData.imageLayout,
      google_drive_folder_id: courseData.googleDriveFolderId,
      google_drive_folder_url: courseData.googleDriveFolderUrl,
      updated_at: new Date().toISOString()
    };
    
    console.log("Prepared DB data for update:", dbCourseData);

    const { error } = await supabase
      .from('courses')
      .update(dbCourseData)
      .eq('id', id);

    if (error) {
      console.error(`Error updating course with ID ${id}:`, error);
      
      // Check for specific errors
      if (error.code === '42501') {
        throw new Error("Permission denied: You don't have access to update this course");
      }
      throw error;
    }

    console.log(`Course with ID ${id} updated successfully`);
    return true;
  } catch (error: any) {
    console.error(`Failed to update course with ID ${id}:`, error);
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting course with ID ${id}`);
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("No active session found");
      toast.error("Authentication required", {
        description: "You must be logged in to delete a course"
      });
      return false;
    }

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting course with ID ${id}:`, error);
      // Check for specific errors
      if (error.code === '42501') {
        throw new Error("Permission denied: You don't have access to delete this course");
      }
      throw error;
    }

    console.log(`Course with ID ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Failed to delete course with ID ${id}:`, error);
    throw error;
  }
};

// Export the necessary functions from course queries and mutations
export { 
  createCourseFromTemplate,
  getScheduledCourses
};
