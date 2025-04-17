
import React from "react";
import { Course } from "@/types/course";
import { CourseManagementHeader } from "./CourseManagementHeader";
import { CourseTable } from "./CourseTable";
import CourseFormDialog from "@/components/courses/CourseFormDialog";
import { DeleteConfirmationDialog } from "../users/DeleteConfirmationDialog";
import CourseRegistrations from "./CourseRegistrations";
import { useCourseManagement } from "@/hooks/useCourseManagement";

export const CourseManagementContainer: React.FC = () => {
  const {
    courses,
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
    handleFormSubmit,
    handleDelete
  } = useCourseManagement();

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

  const handleViewRegistrations = (course: Course) => {
    setCurrentCourse(course);
    setViewingRegistrations(true);
  };

  if (viewingRegistrations && currentCourse) {
    return (
      <CourseRegistrations 
        course={currentCourse}
        onBack={() => setViewingRegistrations(false)}
      />
    );
  }

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <CourseManagementHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddCourse}
      />
      
      <CourseTable 
        courses={courses} 
        onEdit={handleEditCourse} 
        onDelete={handleDeleteConfirm}
        onViewRegistrations={handleViewRegistrations}
      />
      
      <CourseFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        currentCourse={currentCourse}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsFormOpen(false)}
      />

      <DeleteConfirmationDialog 
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
};
