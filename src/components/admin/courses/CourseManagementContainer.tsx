
import React, { useState } from "react";
import { CourseManagementHeader } from "./CourseManagementHeader";
import { CourseTable } from "./CourseTable";
import { CourseLoadingState } from "./CourseLoadingState";
import { CourseErrorAlert } from "./CourseErrorAlert";
import { CourseDialogs } from "./CourseDialogs";
import { useCourseManagement } from "@/hooks/useCourseManagement";
import { useCourseFiltering } from "@/hooks/useCourseFiltering";
import { useCourseActions } from "@/hooks/useCourseActions";
import { useMediaLibraryDialog } from "@/hooks/useMediaLibraryDialog";
import { useScheduleCourseDialog } from "@/hooks/useScheduleCourseDialog";
import { CourseTypeTabs } from "./CourseTypeTabs";
import { CourseTemplatesSection } from "./CourseTemplatesSection";

export const CourseManagementContainer: React.FC = () => {
  const {
    courses,
    templates,
    isLoading,
    loadError,
    handleFormSubmit,
    handleDelete,
    handleForceReset,
    refreshCourses
  } = useCourseManagement();

  const {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filteredCourses,
    eventTypes
  } = useCourseFiltering(courses);

  const {
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
  } = useCourseActions();

  const {
    mediaLibOpen,
    setMediaLibOpen,
    formData,
    setFormData,
    handleMediaSelect
  } = useMediaLibraryDialog(currentCourse);

  // Initialize formData setter in course actions
  initializeSetFormData(setFormData);

  const {
    scheduleDialogOpen,
    setScheduleDialogOpen,
    selectedTemplate,
    isScheduling,
    handleScheduleCourse,
    handleScheduleSubmit
  } = useScheduleCourseDialog(refreshCourses);
  
  // Set initial active tab to "scheduled" for clarity
  useState(() => {
    if (activeTab === "all") {
      setActiveTab("scheduled");
    }
  });

  // View mode determines whether we're viewing scheduled events or templates
  const isTemplateView = activeTab === "templates";

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <CourseManagementHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddCourse}
        isTemplateView={isTemplateView}
      />
      
      <CourseTypeTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        eventTypes={eventTypes} 
      />
      
      {loadError && (
        <CourseErrorAlert 
          error={loadError}
          onRetry={handleForceReset}
        />
      )}
      
      {isLoading ? (
        <CourseLoadingState />
      ) : isTemplateView ? (
        <CourseTemplatesSection
          templates={templates}
          onEdit={handleEditCourse}
          onDelete={handleDeleteConfirm}  // Changed to use handleDeleteConfirm to match the regular course flow
          onSchedule={handleScheduleCourse}
          onDuplicate={handleDuplicateCourse}
        />
      ) : (
        <CourseTable 
          courses={filteredCourses}
          onEdit={handleEditCourse} 
          onDelete={handleDeleteConfirm}
          onDuplicate={handleDuplicateCourse}
          onSchedule={handleScheduleCourse}
        />
      )}

      <CourseDialogs
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        isConfirmDialogOpen={isConfirmDialogOpen}
        setIsConfirmDialogOpen={setIsConfirmDialogOpen}
        scheduleDialogOpen={scheduleDialogOpen}
        setScheduleDialogOpen={setScheduleDialogOpen}
        currentCourse={currentCourse}
        selectedTemplate={selectedTemplate}
        formData={formData}
        setFormData={setFormData}
        handleFormSubmit={handleFormSubmit}
        handleDelete={handleDelete}
        handleScheduleSubmit={handleScheduleSubmit}
        mediaLibOpen={mediaLibOpen}
        setMediaLibOpen={setMediaLibOpen}
        handleMediaSelect={handleMediaSelect}
        isScheduling={isScheduling}
      />
    </div>
  );
};
