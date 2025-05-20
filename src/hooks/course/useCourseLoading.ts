
import { useCallback } from "react";
import { toast } from "sonner";
import { getAllCourses } from "@/services/course/courseQueries";
import { Course } from "@/types/course";

/**
 * Hook for loading course data
 * Extracted from useCourseManagement to improve code organization
 */
export const useCourseLoading = (
  setIsLoading: (loading: boolean) => void,
  setLoadError: (error: string | null) => void,
  showDeleted: boolean,
  setTemplates: (templates: Course[]) => void,
  setCourses: (courses: Course[]) => void
) => {
  const loadCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      
      console.log("Loading all courses...");
      const allCourses = await getAllCourses();
      
      if (!allCourses || allCourses.length === 0) {
        console.log("No courses loaded or empty array returned");
      } else {
        console.log(`Loaded ${allCourses.length} courses successfully`);
      }
      
      // Filter courses based on deletedAt status
      const filteredCourses = allCourses.filter(course => {
        if (!showDeleted && course.deletedAt) return false;
        return true;
      });

      // Separate templates and scheduled courses
      const templateCourses = filteredCourses.filter(course => course.isTemplate === true);
      const scheduledCourses = filteredCourses.filter(course => course.isTemplate !== true);
      
      console.log(`Filtered to ${templateCourses.length} template courses and ${scheduledCourses.length} scheduled courses`);
      setTemplates(templateCourses);
      setCourses(scheduledCourses);
    } catch (error: any) {
      console.error("Error loading courses:", error);
      setLoadError(error?.message || "Failed to load courses");
      
      // Check for specific error types
      if (error.message?.includes('infinite recursion detected')) {
        setLoadError("Database permission configuration issue detected. Please try again in a few moments.");
        toast.error("Permission configuration issue", {
          description: "The system is experiencing a temporary permission issue."
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [showDeleted, setIsLoading, setLoadError, setCourses, setTemplates]);
  
  return { loadCourses };
};
