
import React from "react";
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
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CourseManagementContainer: React.FC = () => {
  const {
    courses,
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
  
  const navigate = useNavigate();
  
  const handleNavigateToTemplates = () => {
    navigate('/admin?tab=settings&section=templates');
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <div className="flex justify-between items-center mb-4">
        <CourseManagementHeader 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddNew={handleAddCourse}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNavigateToTemplates}
          className="flex items-center gap-1"
        >
          <Settings size={16} />
          <span>Manage Templates</span>
        </Button>
      </div>
      
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
