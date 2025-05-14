
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseFormData } from "@/types/course";
import { toast } from "sonner";
import { mapDbToCourse, mapCourseToDb } from "../courseMappers";
import { executeQuery } from "@/utils/supabase/query";
import { getAuthenticatedUser, checkAdminRole, handleMutationError } from "./baseCourseMutation";

export const createCourse = async (courseData: CourseFormData): Promise<Course | null> => {
  try {
    console.log("Creating course with data:", courseData);
    
    // Check if user is authenticated
    const user = await getAuthenticatedUser();
    if (!user) return null;
    
    // If this is a template, verify admin role
    if (courseData.isTemplate && !(await checkAdminRole(user.id))) {
      return null;
    }

    const dbCourseData = mapCourseToDb(courseData);
    
    const newCourse = {
      ...dbCourseData,
      created_by: user.id
    };
    
    console.log("Creating course with data:", newCourse);
    console.log("Is template:", newCourse.is_template);
    
    // Ensure required fields for templates
    if (newCourse.is_template) {
      // Ensure template required fields have defaults
      newCourse.dates = newCourse.dates || "Template - No Dates";
      newCourse.location = newCourse.location || "To Be Determined";
      newCourse.instructor = newCourse.instructor || "To Be Assigned";
      newCourse.spots_available = newCourse.spots_available || 0;
    }

    // Log the complete object being sent to the database
    console.log("Full course object being sent to database:", JSON.stringify(newCourse, null, 2));
    
    // Use executeQuery helper with proper timeouts and retries
    const { data, error } = await executeQuery<any>(
      async () => await supabase
        .from('courses')
        .insert(newCourse)
        .select()
        .single(),
      {
        timeoutMs: 30000, // Increased timeout for course operations
        showErrorToast: true,
        errorMessage: "Failed to create course",
        retries: 2
      }
    );
      
    if (error) {
      handleMutationError(error, "Failed to create course");
      return null;
    }
    
    toast.success(newCourse.is_template ? "Template created successfully" : "Course created successfully");
    return mapDbToCourse(data);
  } catch (err) {
    handleMutationError(err, "Failed to create course");
    return null;
  }
};
