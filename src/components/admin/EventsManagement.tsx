
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { CourseTable } from "./courses/CourseTable";
import { CourseLoadingState } from "./courses/CourseLoadingState";
import { CourseErrorAlert } from "./courses/CourseErrorAlert";
import { CourseDialogs } from "./courses/CourseDialogs";
import { CourseTemplatesSection } from "./courses/CourseTemplatesSection";
import { EventTypesSettings } from "./settings/EventTypesSettings";
import { EventCategoriesSettings } from "./settings/EventCategoriesSettings";
import { useCourseManagement } from "@/hooks/useCourseManagement";
import { useCourseFiltering } from "@/hooks/useCourseFiltering";
import { useMediaLibraryDialog } from "@/hooks/useMediaLibraryDialog";
import { useScheduleCourseDialog } from "@/hooks/useScheduleCourseDialog";
import { useLocation, useNavigate } from "react-router-dom";

const EventsManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('eventTab');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "scheduled");

  const {
    courses,
    templates,
    isLoading,
    loadError,
    handleFormSubmit,
    handleDelete,
    handleForceReset,
    refreshCourses,
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
  } = useCourseManagement();

  const {
    searchTerm,
    setSearchTerm,
    filteredCourses
  } = useCourseFiltering(courses);

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

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(location.search);
    newParams.set('eventTab', value);
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleAddEvent = () => {
    setCurrentCourse(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-agile-purple-dark mb-2">Event Management</h2>
        <p className="text-gray-600">Manage and schedule your events</p>
      </div>

      {/* Search and Add Event Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAddEvent} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scheduled">Scheduled Events</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="event-types">Event Types</TabsTrigger>
          <TabsTrigger value="event-categories">Event Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scheduled" className="mt-6">
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
        </TabsContent>
        
        <TabsContent value="templates" className="mt-6">
          {loadError && (
            <CourseErrorAlert 
              error={loadError}
              onRetry={handleForceReset}
            />
          )}
          
          {isLoading ? (
            <CourseLoadingState />
          ) : (
            <CourseTemplatesSection
              templates={templates}
              onEdit={handleEditCourse}
              onDelete={handleDeleteConfirm}
              onSchedule={handleScheduleCourse}
              onDuplicate={handleDuplicateCourse}
            />
          )}
        </TabsContent>
        
        <TabsContent value="event-types" className="mt-6">
          <EventTypesSettings />
        </TabsContent>
        
        <TabsContent value="event-categories" className="mt-6">
          <EventCategoriesSettings />
        </TabsContent>
      </Tabs>

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

export default EventsManagement;
