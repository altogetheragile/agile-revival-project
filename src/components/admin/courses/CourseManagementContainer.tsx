
import React, { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { CourseManagementHeader } from "./CourseManagementHeader";
import { CourseTable } from "./CourseTable";
import { CourseLoadingState } from "./CourseLoadingState";
import { CourseErrorAlert } from "./CourseErrorAlert";
import { CourseDialogs } from "./CourseDialogs";
import { useToast } from "@/components/ui/use-toast";
import { useCourseManagement } from "@/hooks/useCourseManagement";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    handleFormSubmit,
    handleDelete,
    handleForceReset
  } = useCourseManagement();

  const { toast } = useToast();
  const [formData, setFormData] = useState<Course | null>(null);
  const [mediaLibOpen, setMediaLibOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

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

  // Filter courses by event type
  const filteredCourses = courses.filter(course => {
    // First apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = course.title.toLowerCase().includes(searchLower) ||
        (course.eventType && course.eventType.toLowerCase().includes(searchLower)) ||
        course.category.toLowerCase().includes(searchLower) ||
        (course.instructor && course.instructor.toLowerCase().includes(searchLower)) ||
        (course.location && course.location.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    // Then apply event type filter
    if (activeTab === "all") return true;
    return course.eventType === activeTab;
  });
  
  // Get unique event types for tabs
  const eventTypes = ["all", ...Array.from(new Set(courses.map(c => c.eventType || "course")))];

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <CourseManagementHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddCourse}
      />
      
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all">
          <TabsList>
            {eventTypes.map(type => (
              <TabsTrigger key={type} value={type} className="capitalize">
                {type === "all" ? "All Types" : type}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
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
        />
      )}

      <CourseDialogs
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        isConfirmDialogOpen={isConfirmDialogOpen}
        setIsConfirmDialogOpen={setIsConfirmDialogOpen}
        currentCourse={currentCourse}
        formData={formData}
        setFormData={setFormData}
        handleFormSubmit={handleFormSubmit}
        handleDelete={handleDelete}
        mediaLibOpen={mediaLibOpen}
        setMediaLibOpen={setMediaLibOpen}
        handleMediaSelect={handleMediaSelect}
      />
    </div>
  );
};
