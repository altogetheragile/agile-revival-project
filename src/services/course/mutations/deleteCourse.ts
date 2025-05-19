
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { executeQuery } from "@/utils/supabase/query";
import { getAuthenticatedUser, checkAdminRole, handleMutationError } from "./baseCourseMutation";

export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting course with ID:", id);
    
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

    // First verify the course exists
    const { data: existingCourse, error: fetchError } = await supabase
      .from('courses')
      .select('id, title, is_template')
      .eq('id', id)
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
    
    console.log(`Course found, deleting: ${existingCourse.title} (${existingCourse.id})`);
    console.log(`Is template: ${existingCourse.is_template}`);

    // Use optimized query with better error handling
    const { error } = await executeQuery(
      async () => await supabase
        .from('courses')
        .delete()
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
    toast.success(existingCourse.is_template ? "Template deleted successfully" : "Course deleted successfully");
    return true;
  } catch (err) {
    console.error("Exception in deleteCourse:", err);
    handleMutationError(err, "Failed to delete course");
    return false;
  }
};
