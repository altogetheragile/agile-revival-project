
import { useToast } from "@/components/ui/use-toast";
import { Course, CourseFormData } from "@/types/course";
import { createCourse, updateCourse, deleteCourse } from "@/services/course/courseMutations";
import { getCourseById } from "@/services/course/courseQueries";
import { toast } from "sonner";

/**
 * Hook for course CRUD actions
 * Extracted from useCourseManagement to improve code organization
 */
export const useCourseActions = (
  setIsFormOpen: (open: boolean) => void,
  setIsConfirmDialogOpen: (open: boolean) => void,
  currentCourse: Course | null,
  setCurrentCourse: (course: Course | null) => void,
  deleteCourseId: string | null,
  setDeleteCourseId: (id: string | null) => void,
  refreshCourses: () => Promise<void>
) => {
  const { toast: uiToast } = useToast();

  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      console.log("Submitting course form data:", data);
      
      // We now handle both template and scheduled event types here
      console.log("Is this a template?", data.isTemplate);

      if (currentCourse) {
        console.log("Updating existing course:", currentCourse.id);
        const updated = await updateCourse(currentCourse.id, data);
        
        if (updated) {
          console.log("Course updated successfully");
          await refreshCourses();
          // Only update currentCourse if we have a valid Course object, not just a boolean success value
          const updatedCourse = await getCourseById(currentCourse.id);
          if (updatedCourse) {
            setCurrentCourse(updatedCourse);
          }
          uiToast({
            title: data.isTemplate ? "Template updated" : "Event updated",
            description: `"${data.title}" has been updated successfully.`
          });
          setIsFormOpen(false);
        }
      } else {
        console.log("Creating new course");
        const created = await createCourse(data);
        
        if (created) {
          console.log("Course created successfully");
          await refreshCourses();
          uiToast({
            title: data.isTemplate ? "Template created" : "Event created",
            description: `"${data.title}" has been created successfully.`
          });
          setIsFormOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Error handling course submission:", error);
      
      // Enhanced error handling
      let errorMessage = "There was a problem saving the event.";
      if (error.message?.includes('infinite recursion detected')) {
        errorMessage = "Permission configuration issue detected. Please try again in a few moments.";
      } else if (error.message?.includes('violates row-level security policy')) {
        errorMessage = "You don't have permission to perform this action.";
      }
      
      uiToast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteCourseId) {
      console.error("Deletion attempted with no course ID specified");
      toast.error("Error", {
        description: "Cannot delete: No course was selected"
      });
      setIsConfirmDialogOpen(false);
      return;
    }

    try {
      console.log("Attempting to delete course with ID:", deleteCourseId);
      const success = await deleteCourse(deleteCourseId);
      
      if (success) {
        await refreshCourses();
        uiToast({
          title: "Event deleted",
          description: "The event has been removed successfully."
        });
      } else {
        throw new Error("Failed to delete the course for unknown reasons");
      }
    } catch (error: any) {
      console.error("Error deleting course:", error);
      
      // Enhanced error handling
      let errorMessage = "There was a problem deleting the event.";
      if (error.message?.includes('infinite recursion detected')) {
        errorMessage = "Permission configuration issue detected. Please try again in a few moments.";
      } else if (error.message?.includes('violates row-level security policy')) {
        errorMessage = "You don't have permission to perform this action.";
      }
      
      uiToast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsConfirmDialogOpen(false);
      setDeleteCourseId(null);
    }
  };

  const handleForceReset = () => {
    toast.success("Cache reset", {
      description: "The event data has been refreshed from the database."
    });
    
    refreshCourses();
  };

  return {
    handleFormSubmit,
    handleDelete,
    handleForceReset
  };
};
