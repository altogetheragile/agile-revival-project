
import React from "react";
import { Course } from "@/types/course";
import { CourseManagementHeader } from "./CourseManagementHeader";
import { CourseTable } from "./CourseTable";
import CourseRegistrations from "./CourseRegistrations";
import { useCourseManagement } from "@/hooks/useCourseManagement";
import { CourseActionButtons } from "./CourseActionButtons";
import { CourseLoadingState } from "./CourseLoadingState";
import { CourseErrorAlert } from "./CourseErrorAlert";
import { CourseDialogs } from "./CourseDialogs";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { createCourseFromTemplate } from "@/services/courseTemplateService";

export const CourseManagementContainer: React.FC = () => {
  const {
    courses,
    isLoading,
    loadError,
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
    handleDelete,
    handleForceReset
  } = useCourseManagement();

  const { toast } = useToast();
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Course | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [mediaLibOpen, setMediaLibOpen] = useState(false);
  const [formData, setFormData] = useState<Course | null>(null);

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

  const handleScheduleCourse = (template: Course) => {
    setSelectedTemplate(template);
    setScheduleDialogOpen(true);
  };

  const handleScheduleSubmit = async (data: any) => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "No template selected for scheduling",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsScheduling(true);
      const scheduledCourse = await createCourseFromTemplate(selectedTemplate.id, data);
      
      if (scheduledCourse) {
        toast({
          title: "Course scheduled",
          description: `${scheduledCourse.title} has been scheduled.`,
        });
        setScheduleDialogOpen(false);
        handleForceReset();
      }
    } catch (error: any) {
      console.error("Error scheduling course:", error);
      toast({
        title: "Error",
        description: error?.message || "There was a problem scheduling the course.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const handleMediaSelect = (url: string, aspectRatio?: string, size?: number, layout?: string) => {
    if (currentCourse) {
      setFormData({
        ...currentCourse,
        imageUrl: url,
        imageAspectRatio: aspectRatio || "16/9",
        imageSize: size || 100,
        imageLayout: layout || "standard"
      });
    }
    setMediaLibOpen(false);
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
      
      <CourseActionButtons 
        onForceReset={handleForceReset}
        isLoading={isLoading}
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
          courses={courses}
          onEdit={handleEditCourse} 
          onDelete={handleDeleteConfirm}
          onViewRegistrations={setViewingRegistrations}
          onScheduleCourse={handleScheduleCourse}
        />
      )}

      <CourseDialogs
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        isConfirmDialogOpen={isConfirmDialogOpen}
        setIsConfirmDialogOpen={setIsConfirmDialogOpen}
        scheduleDialogOpen={scheduleDialogOpen}
        setScheduleDialogOpen={setScheduleDialogOpen}
        mediaLibOpen={mediaLibOpen}
        setMediaLibOpen={setMediaLibOpen}
        currentCourse={currentCourse}
        selectedTemplate={selectedTemplate}
        formData={formData}
        setFormData={setFormData}
        handleFormSubmit={handleFormSubmit}
        handleDelete={handleDelete}
        handleScheduleSubmit={handleScheduleSubmit}
        handleMediaSelect={handleMediaSelect}
        isScheduling={isScheduling}
      />
    </div>
  );
};
