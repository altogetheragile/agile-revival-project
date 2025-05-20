
import { useState } from "react";
import { Course } from "@/types/course";

/**
 * Hook for managing course state
 * Extracted from useCourseManagement to improve code organization
 */
export const useCourseState = () => {
  // Basic state
  const [courses, setCourses] = useState<Course[]>([]);
  const [templates, setTemplates] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  
  // Toggle showing deleted courses
  const toggleShowDeleted = () => {
    setShowDeleted(prev => !prev);
  };

  return {
    // Basic state
    courses,
    setCourses,
    templates,
    setTemplates,
    searchTerm,
    setSearchTerm,
    isLoading,
    setIsLoading,
    loadError,
    setLoadError,
    
    // UI state
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
    showDeleted,
    
    // Actions
    toggleShowDeleted
  };
};
