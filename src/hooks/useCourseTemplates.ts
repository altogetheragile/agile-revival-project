
import { useState, useEffect } from 'react';
import { Course, CourseFormData } from '@/types/course';
import { getCourseTemplates, createCourse, updateCourse, deleteCourse } from '@/services/courseService';
import { toast } from 'sonner';

export const useCourseTemplates = () => {
  const [templates, setTemplates] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Course | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  
  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const courseTemplates = await getCourseTemplates();
      console.log("Loaded templates:", courseTemplates);
      setTemplates(courseTemplates);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Error loading templates", {
        description: error instanceof Error ? error.message : "Failed to load course templates"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleAddTemplate = () => {
    setCurrentTemplate(null);
    setIsFormOpen(true);
  };

  const handleEditTemplate = (template: Course) => {
    console.log("Editing template:", template);
    setCurrentTemplate(template);
    setIsFormOpen(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const success = await deleteCourse(templateId);
      if (success) {
        await loadTemplates();
        toast.success("Template deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Error deleting template", {
        description: error instanceof Error ? error.message : "Failed to delete template"
      });
    }
  };

  const handleScheduleCourse = (template: Course) => {
    setCurrentTemplate(template);
    setIsScheduleDialogOpen(true);
  };

  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      console.log("Form submitted with data:", data);
      
      // Ensure required fields have default values and isTemplate is true
      const templateData: CourseFormData = {
        ...data,
        isTemplate: true,
        // Add defaults for required fields in the database
        dates: data.dates || "Template - No Dates",
        location: data.location || "To Be Determined",
        instructor: data.instructor || "To Be Assigned",
        spotsAvailable: data.spotsAvailable || 0,
      };
      
      console.log("Processed template data:", templateData);

      if (currentTemplate) {
        console.log("Updating existing template with ID:", currentTemplate.id);
        const updated = await updateCourse(currentTemplate.id, templateData);
        if (updated) {
          await loadTemplates();
          setIsFormOpen(false);
          toast.success("Template updated successfully");
        }
      } else {
        console.log("Creating new template");
        const created = await createCourse(templateData);
        if (created) {
          await loadTemplates();
          setIsFormOpen(false);
          toast.success("Template created successfully");
        }
      }
    } catch (error: any) {
      console.error("Error saving template:", error);
      toast.error("Error saving template", {
        description: error?.message || "Failed to save the template"
      });
    }
  };

  return {
    templates,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    currentTemplate,
    isScheduleDialogOpen,
    setIsScheduleDialogOpen,
    handleAddTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    handleScheduleCourse,
    handleFormSubmit,
    loadTemplates
  };
};
