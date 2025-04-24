
import React, { useState, useEffect } from "react";
import { Course, ScheduleCourseFormData } from "@/types/course";
import { CourseManagementHeader } from "./CourseManagementHeader";
import { CourseTable } from "./CourseTable";
import CourseFormDialog from "@/components/courses/CourseFormDialog";
import { DeleteConfirmationDialog } from "../users/DeleteConfirmationDialog";
import CourseRegistrations from "./CourseRegistrations";
import { useCourseManagement } from "@/hooks/useCourseManagement";
import ScheduleCourseDialog from "@/components/courses/ScheduleCourseDialog";
import { useToast } from "@/components/ui/use-toast";
import { createCourseFromTemplate } from "@/services/courseTemplateService";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, AlertTriangle } from "lucide-react";
import MediaLibrary from "@/components/media/MediaLibrary";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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

  const templateCourses = courses;

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

  const handleScheduleCourse = (template: Course) => {
    console.log("Scheduling course from template:", template);
    setSelectedTemplate(template);
    setScheduleDialogOpen(true);
  };

  const handlePreviewTemplate = (template: Course) => {
    toast({
      title: "Previewing template",
      description: `Now previewing "${template.title}"`,
    });
  };

  const handleScheduleSubmit = async (data: ScheduleCourseFormData) => {
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
      console.log("Submitting schedule data:", data);
      
      const scheduledCourse = await createCourseFromTemplate(selectedTemplate.id, data);
      
      if (scheduledCourse) {
        toast({
          title: "Course scheduled",
          description: `${scheduledCourse.title} has been scheduled.`,
        });
        
        // After successful scheduling, close the dialog and refresh the course list
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
      
      <div className="mb-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleForceReset}
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
      
      {loadError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error loading courses</AlertTitle>
          <AlertDescription>
            {loadError}
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleForceReset}
                className="bg-red-50 text-red-800 hover:bg-red-100"
              >
                <RefreshCw className="mr-1 h-3 w-3" /> Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-3 text-gray-500">Loading course templates...</span>
        </div>
      ) : (
        <CourseTable 
          courses={courses}
          onEdit={handleEditCourse} 
          onDelete={handleDeleteConfirm}
          onViewRegistrations={handleViewRegistrations}
          onScheduleCourse={handleScheduleCourse}
          onPreviewTemplate={handlePreviewTemplate}
        />
      )}
      
      <CourseFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        currentCourse={currentCourse}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsFormOpen(false)}
        onOpenMediaLibrary={() => setMediaLibOpen(true)}
        formData={formData}
        setFormData={setFormData}
      />

      <DeleteConfirmationDialog 
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleDelete}
      />

      <ScheduleCourseDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        template={selectedTemplate}
        onSubmit={handleScheduleSubmit}
        onCancel={() => setScheduleDialogOpen(false)}
        onOpenMediaLibrary={() => setMediaLibOpen(true)}
        isSubmitting={isScheduling}
      />

      <MediaLibrary
        open={mediaLibOpen}
        onOpenChange={setMediaLibOpen}
        onSelect={handleMediaSelect}
      />
    </div>
  );
};
