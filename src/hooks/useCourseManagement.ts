
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Course, CourseFormData } from "@/types/course";
import { toast } from "sonner";
import { getAllCourses } from "@/services/course/courseQueries";
import { createCourse, updateCourse, deleteCourse } from "@/services/course/courseMutations";
import { getCourseById } from "@/services/course/courseQueries";

export const useCourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [templates, setTemplates] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState(false); // State for showing/hiding deleted items
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
  }, [showDeleted]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

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
          await loadCourses();
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
          await loadCourses();
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
    if (deleteCourseId) {
      try {
        const success = await deleteCourse(deleteCourseId);
        if (success) {
          await loadCourses();
          uiToast({
            title: "Event deleted",
            description: "The event has been removed successfully."
          });
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
    }
  };

  const handleForceReset = () => {
    toast.success("Cache reset", {
      description: "The event data has been refreshed from the database."
    });
    
    loadCourses();
  };

  // Toggle showing deleted courses
  const toggleShowDeleted = () => {
    setShowDeleted(prev => !prev);
  };

  return {
    courses,
    templates,
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
    showDeleted,
    toggleShowDeleted,
    handleFormSubmit,
    handleDelete,
    handleForceReset,
    refreshCourses: loadCourses
  };
};
