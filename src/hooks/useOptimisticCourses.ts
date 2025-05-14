
import { useState, useCallback, useEffect, useRef } from "react";
import { Course } from "@/types/course";
import { getScheduledCourses, updateCourse, deleteCourse } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

export const useOptimisticCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const previousCoursesRef = useRef<Course[]>([]);
  const { toast: uiToast } = useToast();

  // Fetch courses initially and set up refreshing
  const fetchCourses = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setIsRefreshing(true);
      }
      const scheduledCourses = await getScheduledCourses();
      setCourses(scheduledCourses);
      previousCoursesRef.current = scheduledCourses;
      setLoadError(null);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoadError(error instanceof Error ? error : new Error("Failed to fetch courses"));
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Refresh courses in the background without loading state
  const refreshCoursesInBackground = useCallback(async () => {
    try {
      const scheduledCourses = await getScheduledCourses();
      setCourses(scheduledCourses);
      previousCoursesRef.current = scheduledCourses;
      setLoadError(null);
    } catch (error) {
      console.error("Error refreshing courses in background:", error);
      // Don't update the loadError state for background refreshes
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCourses(true);
  }, [fetchCourses]);

  // Optimistic update of a course
  const optimisticUpdateCourse = useCallback(async (courseId: string, courseData: any) => {
    // Find the course to update
    const courseIndex = courses.findIndex((course) => course.id === courseId);
    if (courseIndex === -1) return false;
    
    // Store previous courses state
    previousCoursesRef.current = [...courses];
    
    // Create the updated course
    const updatedCourse = {
      ...courses[courseIndex],
      ...courseData,
    };
    
    // Update the local state immediately
    const updatedCourses = [...courses];
    updatedCourses[courseIndex] = updatedCourse;
    setCourses(updatedCourses);
    
    // Show subtle notification that we're saving
    toast.promise(
      updateCourse(courseId, courseData),
      {
        loading: 'Updating course...',
        success: (result) => {
          if (!result) {
            // If update failed, revert to previous state
            setCourses(previousCoursesRef.current);
            return "Failed to update course";
          }
          return "Course updated successfully";
        },
        error: (error) => {
          // Revert to previous state on error
          setCourses(previousCoursesRef.current);
          return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
        },
      }
    );
    
    return true;
  }, [courses]);

  // Optimistic delete of a course
  const optimisticDeleteCourse = useCallback(async (courseId: string) => {
    // Store previous courses state
    previousCoursesRef.current = [...courses];
    
    // Remove course from local state immediately
    const updatedCourses = courses.filter((course) => course.id !== courseId);
    setCourses(updatedCourses);
    
    // Show subtle notification that we're deleting
    toast.promise(
      deleteCourse(courseId),
      {
        loading: 'Deleting course...',
        success: (result) => {
          if (!result) {
            // If deletion failed, revert to previous state
            setCourses(previousCoursesRef.current);
            return "Failed to delete course";
          }
          return "Course deleted successfully";
        },
        error: (error) => {
          // Revert to previous state on error
          setCourses(previousCoursesRef.current);
          return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
        },
      }
    );
    
    return true;
  }, [courses]);

  // Manual refresh function that shows a toast message
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    toast.promise(
      fetchCourses(false),
      {
        loading: 'Refreshing courses...',
        success: "Courses refreshed successfully",
        error: "Failed to refresh courses",
      }
    );
  }, [fetchCourses]);

  // Handle hard reset (reload page)
  const handleForceReset = useCallback(() => {
    toast.success("Cache reset", {
      description: "The page will reload to refresh data."
    });
    // Force reload the current page
    window.location.reload();
  }, []);

  return {
    courses,
    isInitialLoading,
    isRefreshing,
    loadError,
    refreshCourses: fetchCourses,
    refreshCoursesInBackground,
    optimisticUpdateCourse,
    optimisticDeleteCourse,
    handleManualRefresh,
    handleForceReset
  };
};
