
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
    console.log("Attempting to delete template with ID:", templateId);
    try {
      const success = await deleteCourse(templateId);
      console.log("Delete operation result:", success);
      
      if (success) {
        // Only reload templates if deletion was successful
        await loadTemplates();
        toast({
          title: "Success",
          description: "Template deleted successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete template - operation did not complete successfully",
          variant: "destructive"
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

  const handleFormSubmit = async (data: CourseFormData, propagateChanges: boolean = false) => {
    try {
      console.log("Form submitted with data:", data);
      console.log("Propagate changes flag:", propagateChanges);

      const templateData = {
        ...data,
        isTemplate: true,
        dates: data.dates || "Template - No Dates",
        location: data.location || "To Be Determined",
        instructor: data.instructor || "To Be Assigned",
        spotsAvailable: data.spotsAvailable || 0,
      };

      if (currentTemplate) {
        console.log("Updating template with ID:", currentTemplate.id);
        console.log("Template data ID before update:", templateData.id);
        
        // Ensure we're using the template ID
        if (!templateData.id && currentTemplate.id) {
          console.log("Setting missing ID from currentTemplate");
          templateData.id = currentTemplate.id;
        }
        
        console.log("Calling updateCourse with ID:", templateData.id);
        console.log("Propagate changes:", propagateChanges);
        
        const updated = await updateCourse(currentTemplate.id, templateData, propagateChanges);
        
        if (updated) {
          await loadTemplates();
          setIsFormOpen(false);
          // Toast is handled in updateCourse with details about propagation
        } else {
          console.error("Update operation returned null");
          toast({
            title: "Error",
            description: "Failed to update template - no data returned",
            variant: "destructive"
          });
        }
      } else {
        console.log("Creating new template");
        const created = await createCourse(templateData);
        if (created) {
          await loadTemplates();
          setIsFormOpen(false);
          toast({
            title: "Success",
            description: "Template created successfully"
          });
        } else {
          console.error("Create operation returned null");
          toast({
            title: "Error",
            description: "Failed to create template - no data returned",
            variant: "destructive"
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
