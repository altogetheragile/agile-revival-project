
import { useState } from 'react';
import { Course, CourseFormData } from '@/types/course';
import { useToast } from '@/components/ui/use-toast';
import { getCourseTemplates } from '@/services/course/courseQueries';
import { createCourse, updateCourse, deleteCourse } from '@/services/course/courseMutations';

export const useCourseTemplateManagement = () => {
  const [templates, setTemplates] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Course | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const courseTemplates = await getCourseTemplates();
      console.log("Loaded templates:", courseTemplates);
      setTemplates(courseTemplates);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast({
        title: "Error",
        description: "Failed to load course templates",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        toast({
          title: "Success",
          description: "Template deleted successfully"
        });
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive"
      });
    }
  };

  const handleScheduleCourse = (template: Course) => {
    setCurrentTemplate(template);
    setIsScheduleDialogOpen(true);
  };

  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      const templateData = {
        ...data,
        isTemplate: true,
        dates: data.dates || "Template - No Dates",
        location: data.location || "To Be Determined",
        instructor: data.instructor || "To Be Assigned",
        spotsAvailable: data.spotsAvailable || 0,
      };

      if (currentTemplate) {
        const updated = await updateCourse(currentTemplate.id, templateData);
        if (updated) {
          await loadTemplates();
          setIsFormOpen(false);
          toast({
            title: "Success",
            description: "Template updated successfully"
          });
        }
      } else {
        const created = await createCourse(templateData);
        if (created) {
          await loadTemplates();
          setIsFormOpen(false);
          toast({
            title: "Success",
            description: "Template created successfully"
          });
        }
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive"
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
