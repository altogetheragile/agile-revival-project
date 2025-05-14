
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseFormData } from "@/types/course";
import { toast } from "sonner";
import { mapDbToCourse, mapCourseToDb } from "../courseMappers";
import { executeQuery } from "@/utils/supabase/query";
import { getAuthenticatedUser, checkAdminRole, handleMutationError } from "./baseCourseMutation";

export const updateCourse = async (id: string, courseData: CourseFormData): Promise<Course | null> => {
  try {
    console.log("Updating course:", id, courseData);
    console.log("Course ID type:", typeof id);
    
    if (!id) {
      console.error("Missing ID for update operation");
      toast.error("Update failed: Missing ID");
      return null;
    }
    
    // Check if user is authenticated
    const user = await getAuthenticatedUser();
    if (!user) return null;

    // If this is a template, verify admin role
    if (courseData.isTemplate && !(await checkAdminRole(user.id))) {
      toast.error("Permission denied", {
        description: "You need admin privileges to update templates"
      });
      return null;
    }

    const dbCourseData = mapCourseToDb(courseData);
    
    // Create update data object directly without destructuring
    const updateData = { ...dbCourseData };
    console.log("Update data prepared:", updateData);
    
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
      console.error("Error in updateCourse:", error);
      handleMutationError(error, "Failed to update course");
      return null;
    }
    
    if (!data) {
      console.error("No data returned from update operation");
      toast.error("Failed to update course", {
        description: "The database returned no data after update"
      });
      return null;
    }

    console.log("Course updated successfully:", data);
    toast.success(courseData.isTemplate ? "Template updated successfully" : "Course updated successfully");
    
    return mapDbToCourse(data);
  } catch (err) {
    console.error("Exception in updateCourse:", err);
    handleMutationError(err, "Failed to update course");
    return null;
  }
};
