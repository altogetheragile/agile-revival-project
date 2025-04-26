
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Course, CourseFormData } from "@/types/course";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "@/services/courseService";
import { toast } from "sonner";

export const useCourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();

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
      
      // In the management view, we're only showing templates
      const templateCourses = allCourses.filter(course => course.isTemplate === true);
      console.log(`Filtered to ${templateCourses.length} template courses`);
      setCourses(templateCourses);
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
  }, []);

  useEffect(() => {
    loadCourses();
    
    // Refresh every 30 seconds
    const intervalId = setInterval(loadCourses, 30000);
    return () => clearInterval(intervalId);
  }, [loadCourses]);

  const filteredCourses = courses.filter(course => {
    const searchLower = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.category.toLowerCase().includes(searchLower) ||
      (course.instructor && course.instructor.toLowerCase().includes(searchLower))
    );
  });

  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      console.log("Submitting course form data:", data);
      
      // Always set isTemplate to true for courses managed here
      const templateData = {
        ...data,
        isTemplate: true
      };
      
      console.log("Using template data:", templateData);

      if (currentCourse) {
        console.log("Updating existing course:", currentCourse.id);
        const updated = await updateCourse(currentCourse.id, templateData);
        
        if (updated) {
          console.log("Course updated successfully:", updated);
          await loadCourses();
          setCurrentCourse(updated);
          uiToast({
            title: "Template updated",
            description: `"${data.title}" has been updated successfully.`
          });
          setIsFormOpen(false);
        }
      } else {
        console.log("Creating new course");
        const created = await createCourse(templateData);
        
        if (created) {
          console.log("Course created successfully:", created);
          await loadCourses();
          setCurrentCourse(created);
          uiToast({
            title: "Template created",
            description: `"${created.title}" has been created successfully.`
          });
          setIsFormOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Error handling course submission:", error);
      
      // Enhanced error handling
      let errorMessage = "There was a problem saving the course template.";
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
    if (deleteCourseId) {
      try {
        const success = await deleteCourse(deleteCourseId);
        if (success) {
          await loadCourses();
          uiToast({
            title: "Template deleted",
            description: "The course template has been removed successfully."
          });
        }
      } catch (error: any) {
        console.error("Error deleting course:", error);
        
        // Enhanced error handling
        let errorMessage = "There was a problem deleting the template.";
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
    }
  };

  const handleForceReset = () => {
    toast.success("Cache reset", {
      description: "The course data has been refreshed from the database."
    });
    
    loadCourses();
  };

  return {
    courses: filteredCourses,
    searchTerm,
    setSearchTerm,
    isFormOpen,
    setIsFormOpen,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    currentCourse,
    setCurrentCourse,
    deleteCourseId,
    setDeleteCourseId,
    viewingRegistrations,
    setViewingRegistrations,
    isLoading,
    loadError,
    handleFormSubmit,
    handleDelete,
    handleForceReset,
    refreshCourses: loadCourses
  };
};
