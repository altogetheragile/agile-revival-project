
import { useState } from "react";
import { Course } from "@/types/course";

export const useCourseActions = () => {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const [setFormDataCallback, setSetFormDataCallback] = useState<((data: Course | null) => void) | null>(null);

  const initializeSetFormData = (callback: (data: Course | null) => void) => {
    setSetFormDataCallback(() => callback);
  };

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
    if (setFormDataCallback) {
      setFormDataCallback(courseCopy);
    }
    setIsFormOpen(true);
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
