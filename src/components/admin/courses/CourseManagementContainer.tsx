
import React, { useState } from "react";
import { Course, ScheduleCourseFormData } from "@/types/course";
import { CourseManagementHeader } from "./CourseManagementHeader";
import { CourseTable } from "./CourseTable";
import CourseFormDialog from "@/components/courses/CourseFormDialog";
import { DeleteConfirmationDialog } from "../users/DeleteConfirmationDialog";
import CourseRegistrations from "./CourseRegistrations";
import { useCourseManagement } from "@/hooks/useCourseManagement";
import ScheduleCourseDialog from "@/components/courses/ScheduleCourseDialog";
import { useToast } from "@/components/ui/use-toast";
import { createCourseFromTemplate } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import MediaLibrary from "@/components/media/MediaLibrary";

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
    handleDelete,
    handleForceReset
  } = useCourseManagement();

  const { toast } = useToast();
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Course | null>(null);
  
  // Media library state
  const [mediaLibOpen, setMediaLibOpen] = useState(false);
  const [formData, setFormData] = useState<Course | null>(null);

  // Filter to only show template courses
  const templateCourses = courses.filter(course => course.isTemplate === true);

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
    setSelectedTemplate(template);
    setScheduleDialogOpen(true);
  };

  const handleScheduleSubmit = (data: ScheduleCourseFormData) => {
    if (!selectedTemplate) return;

    try {
      const scheduledCourse = createCourseFromTemplate(selectedTemplate.id, data);
      
      toast({
        title: "Course scheduled",
        description: `${scheduledCourse.title} has been scheduled for ${data.dates}.`,
      });
      
      setScheduleDialogOpen(false);
    } catch (error) {
      console.error("Error scheduling course:", error);
      toast({
        title: "Error",
        description: "There was a problem scheduling the course.",
        variant: "destructive"
      });
    }
  };

  // Handle media selection
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
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Cache & Reload
        </Button>
      </div>
      
      <CourseTable 
        courses={templateCourses}
        onEdit={handleEditCourse} 
        onDelete={handleDeleteConfirm}
        onViewRegistrations={handleViewRegistrations}
        onScheduleCourse={handleScheduleCourse}
      />
      
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
      />

      <MediaLibrary
        open={mediaLibOpen}
        onOpenChange={setMediaLibOpen}
        onSelect={handleMediaSelect}
      />
    </div>
  );
};
