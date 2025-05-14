
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { executeQuery } from "@/utils/supabase/query";
import { getAuthenticatedUser, checkAdminRole, handleMutationError } from "./baseCourseMutation";

export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting course:", id);
    
    // Check if user is authenticated
    const user = await getAuthenticatedUser();
    if (!user) return false;

    // Verify admin role
    if (!(await checkAdminRole(user.id))) {
      return false;
    }

    // Use optimized query with better error handling
    const { error } = await executeQuery<any>(
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
      handleMutationError(error, "Failed to delete course");
      return false;
    }

    toast.success("Course deleted successfully");
    return true;
  } catch (err) {
    handleMutationError(err, "Failed to delete course");
    return false;
  }
};
