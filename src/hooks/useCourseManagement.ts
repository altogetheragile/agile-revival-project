
import { useState, useEffect } from "react";
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
  const { toast: uiToast } = useToast();

  // Load courses on mount and periodically refresh
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const allCourses = await getAllCourses();
        // Filter to only show template courses in the management view
        const templateCourses = allCourses.filter(course => course.isTemplate === true);
        setCourses(templateCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    loadCourses();
    
    // Refresh every 5 seconds
    const intervalId = setInterval(loadCourses, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Reload courses when form or dialog state changes
  useEffect(() => {
    const refreshCourses = async () => {
      try {
        const allCourses = await getAllCourses();
        const templateCourses = allCourses.filter(course => course.isTemplate === true);
        setCourses(templateCourses);
      } catch (error) {
        console.error("Error refreshing courses:", error);
      }
    };

    refreshCourses();
  }, [isFormOpen, isConfirmDialogOpen]);

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
      // Always set isTemplate to true for courses managed here
      const templateData = {
        ...data,
        isTemplate: true
      };

      if (currentCourse) {
        const updated = await updateCourse(currentCourse.id, templateData);
        if (updated) {
          const allCourses = await getAllCourses();
          const templateCourses = allCourses.filter(course => course.isTemplate === true);
          setCourses(templateCourses);
          setCurrentCourse(updated);
          uiToast({
            title: "Template updated",
            description: `"${data.title}" has been updated successfully.`
          });
        }
      } else {
        const created = await createCourse(templateData);
        if (created) {
          const allCourses = await getAllCourses();
          const templateCourses = allCourses.filter(course => course.isTemplate === true);
          setCourses(templateCourses);
          setCurrentCourse(created);
          uiToast({
            title: "Template created",
            description: `"${created.title}" has been created successfully.`
          });
        }
      }
    } catch (error) {
      console.error("Error handling course submission:", error);
      uiToast({
        title: "Error",
        description: "There was a problem saving the course template.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (deleteCourseId) {
      try {
        const success = await deleteCourse(deleteCourseId);
        if (success) {
          const allCourses = await getAllCourses();
          const templateCourses = allCourses.filter(course => course.isTemplate === true);
          setCourses(templateCourses);
          uiToast({
            title: "Template deleted",
            description: "The course template has been removed successfully."
          });
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        uiToast({
          title: "Error",
          description: "There was a problem deleting the template.",
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
    
    // Force reload the current page
    window.location.reload();
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
    handleFormSubmit,
    handleDelete,
    handleForceReset
  };
};
