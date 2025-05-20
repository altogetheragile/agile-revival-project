
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { executeQuery } from "@/utils/supabase/query";
import { getAuthenticatedUser, checkAdminRole, handleMutationError } from "./baseCourseMutation";

/**
 * Soft-deletes a course by setting the deleted_at field 
 * @param id Course ID to delete
 * @returns Boolean indicating success
 */
export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    console.log("Soft-deleting course with ID:", id);
    
    // Validate the ID parameter
    if (!id || typeof id !== 'string') {
      console.error("Missing or invalid ID for delete operation:", id);
      toast.error("Delete failed", {
        description: "Missing or invalid course ID"
      });
      return false;
    }
    
    // Check if user is authenticated
    const user = await getAuthenticatedUser();
    if (!user) {
      console.error("Authentication failed or user not found");
      return false;
    }

    // Verify admin role
    if (!(await checkAdminRole(user.id))) {
      console.error("User lacks admin privileges required for deletion");
      return false;
    }

    // First verify the course exists and check for dependencies
    const { data: existingCourse, error: fetchError } = await supabase
      .from('courses')
      .select('id, title, is_template')
      .eq('id', id)
      .is('deleted_at', null)
      .single();
    
    if (fetchError) {
      console.error("Error verifying course exists:", fetchError);
      handleMutationError(fetchError, "Failed to locate course for deletion");
      return false;
    }
    
    if (!existingCourse) {
      console.error("Course not found with ID:", id);
      toast.error("Failed to delete course", {
        description: "Course not found with the provided ID"
      });
      return false;
    }
    
    // Check for dependent registrations if this is not a template
    if (!existingCourse.is_template) {
      const { data: registrations, error: regError } = await supabase
        .from('course_registrations')
        .select('id')
        .eq('course_id', id)
        .limit(1);
      
      if (!regError && registrations && registrations.length > 0) {
        console.log("Course has existing registrations, warning the user");
        toast.warning("This course has registrations", {
          description: "Consider unpublishing instead of deleting to preserve registration data"
        });
        // We still allow deletion, but warn the user
      }
    }
    
    console.log(`Course found, soft-deleting: ${existingCourse.title} (${existingCourse.id})`);
    console.log(`Is template: ${existingCourse.is_template}`);

    // Use optimized query with better error handling - update deleted_at instead of deleting
    const { error } = await executeQuery(
      async () => await supabase
        .from('courses')
        .update({
          deleted_at: new Date().toISOString(),
          status: 'deleted'
        })
        .eq('id', id),
      {
        timeoutMs: 20000,
        showErrorToast: true,
        errorMessage: "Failed to delete course",
        retries: 2
      }
    );

    if (error) {
      console.error("Error in deleteCourse:", error);
      handleMutationError(error, "Failed to delete course");
      return false;
    }

    console.log("Course deleted successfully:", id);
    toast.success(existingCourse.is_template ? "Template deleted successfully" : "Event deleted successfully");
    return true;
  } catch (err) {
    console.error("Exception in deleteCourse:", err);
    handleMutationError(err, "Failed to delete course");
    return false;
  }
};
