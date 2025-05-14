
import { useState } from "react";
import { Course } from "@/types/course";

export const useCourseActions = () => {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);

  const handleAddCourse = () => {
    setCurrentCourse(null);
    setIsFormOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setCurrentCourse(course);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = (course: Course) => {
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
    setFormData(courseCopy);
    setIsFormOpen(true);
  };

  // This is intentionally declared but not initialized
  // It will be set by the component that uses this hook
  let setFormData: (data: Course | null) => void;
  
  // Function to initialize setFormData
  const initializeSetFormData = (setter: (data: Course | null) => void) => {
    setFormData = setter;
  };

  return {
    currentCourse,
    setCurrentCourse,
    isFormOpen,
    setIsFormOpen,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    deleteCourseId,
    setDeleteCourseId,
    handleAddCourse,
    handleEditCourse,
    handleDeleteConfirm,
    handleDuplicateCourse,
    initializeSetFormData
  };
};
