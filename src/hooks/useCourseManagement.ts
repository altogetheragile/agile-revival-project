
import { useEffect } from "react";
import { useCourseState } from "./course/useCourseState";
import { useCourseLoading } from "./course/useCourseLoading";
import { useCourseActions } from "./course/useCourseActions";

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

  // Load courses on mount and when showDeleted changes
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Return all the state and functionality
  return {
    ...courseState,
    handleFormSubmit,
    handleDelete,
    handleForceReset,
    refreshCourses: loadCourses
  };
};
