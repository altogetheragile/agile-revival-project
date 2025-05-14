
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseFormData } from "@/types/course";
import { toast } from "sonner";
import { mapDbToCourse, mapCourseToDb } from "../courseMappers";
import { executeQuery } from "@/utils/supabase/query";
import { getAuthenticatedUser, checkAdminRole, handleMutationError } from "./baseCourseMutation";

export const updateCourse = async (id: string, courseData: CourseFormData): Promise<Course | null> => {
  try {
    console.log("Updating course:", id, courseData);
    
    // Check if user is authenticated
    const user = await getAuthenticatedUser();
    if (!user) return null;

    // If this is a template, verify admin role
    if (courseData.isTemplate && !(await checkAdminRole(user.id))) {
      return null;
    }

    const dbCourseData = mapCourseToDb(courseData);
    
    // Create update data object directly without destructuring
    const updateData = { ...dbCourseData };
    
    // Use optimized query with better error handling
    const { data, error } = await executeQuery<any>(
      async () => await supabase
        .from('courses')
        .update({ 
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single(),
      {
        timeoutMs: 30000, // Increased timeout for course operations
        showErrorToast: true,
        errorMessage: "Failed to update course",
        retries: 2
      }
    );

    if (error) {
      handleMutationError(error, "Failed to update course");
      return null;
    }

    toast.success(courseData.isTemplate ? "Template updated successfully" : "Course updated successfully");
    return mapDbToCourse(data);
  } catch (err) {
    handleMutationError(err, "Failed to update course");
    return null;
  }
};
