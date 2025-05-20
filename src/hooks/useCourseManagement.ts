
import { useEffect } from "react";
import { useCourseState } from "./course/useCourseState";
import { useCourseLoading } from "./course/useCourseLoading";
import { useCourseActions } from "./course/useCourseActions";
import { Course } from "@/types/course";

/**
 * Main hook that composes all course management functionality
 * This is a facade that brings together the smaller, more focused hooks
 */
export const useCourseManagement = () => {
  // Get course state from the state hook
  const courseState = useCourseState();
  
  const {
    courses, setCourses,
    templates, setTemplates,
    isLoading, setIsLoading,
    loadError, setLoadError,
    showDeleted,
    setIsFormOpen,
    setIsConfirmDialogOpen,
    currentCourse, setCurrentCourse,
    deleteCourseId, setDeleteCourseId
  } = courseState;

  // Get course loading functionality
  const { loadCourses } = useCourseLoading(
    setIsLoading,
    setLoadError,
    showDeleted,
    setTemplates,
    setCourses
  );

  // Get course action functionality
  const { handleFormSubmit, handleDelete, handleForceReset } = useCourseActions(
    setIsFormOpen,
    setIsConfirmDialogOpen,
    currentCourse,
    setCurrentCourse,
    deleteCourseId,
    setDeleteCourseId,
    loadCourses
  );

  // UI action handlers needed by CourseManagementContainer
  const handleAddCourse = (isTemplate = false) => {
    // Create a new empty course with appropriate defaults based on type
    const newCourse: Partial<Course> = {
      title: "",
      description: "",
      dates: "",
      location: isTemplate ? "To Be Determined" : "",
      instructor: isTemplate ? "To Be Assigned" : "",
      price: "",
      category: "programming", // Default category
      eventType: "course", // Default event type
      spotsAvailable: isTemplate ? 0 : 10,
      isTemplate: isTemplate,
      status: "draft",
      // Default image settings
      imageAspectRatio: "16/9",
      imageSize: 100,
      imageLayout: "standard"
    };
    
    setCurrentCourse(newCourse as Course);
    setIsFormOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    console.log("Editing course:", course);
    setCurrentCourse(course);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = (course: Course) => {
    console.log("Setting up deletion for course:", course.id, course.title);
    setCurrentCourse(course);
    setDeleteCourseId(course.id);
    setIsConfirmDialogOpen(true);
  };

  const handleDuplicateCourse = (course: Course) => {
    // Create a copy of the course without the ID
    const courseCopy: Course = { 
      ...course,
      title: `Copy of ${course.title}`,
      status: 'draft' as "draft"
    };
    // Remove the id from the copy
    delete (courseCopy as any).id;
    setCurrentCourse(null);
    setIsFormOpen(true);
  };

  // Utility function to initialize the form data setter
  const initializeSetFormData = (callback: (data: Course | null) => void) => {
    // This is a function that will be called from CourseManagementContainer
    // to set up the form data
  };

  // Load courses on mount and when showDeleted changes
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Return all the state and functionality
  return {
    // State from useCourseState
    ...courseState,
    
    // Actions from useCourseActions
    handleFormSubmit,
    handleDelete,
    handleForceReset,
    refreshCourses: loadCourses,
    
    // UI action handlers needed by CourseManagementContainer
    handleAddCourse,
    handleEditCourse,
    handleDeleteConfirm,
    handleDuplicateCourse,
    initializeSetFormData
  };
};
