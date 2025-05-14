import { useState, useEffect, useCallback } from 'react';
import { Course, CourseFormData } from '@/types/course';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getCourseTemplates } from '@/services/course/courseQueries';
import { createCourse, updateCourse, deleteCourse } from '@/services/course/courseMutations';
import { updateCoursesFromTemplate } from '@/services/templates/templateMutations';
import { useSiteSettings } from '@/contexts/site-settings';

export const useCourseTemplates = () => {
  const [templates, setTemplates] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Course | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { user, isAdmin } = useAuth();
  const { settings } = useSiteSettings();
  
  // Get template sync preferences from settings or use default (prompt)
  const templateSyncMode = settings?.templates?.syncMode || 'prompt';
  
  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Loading course templates...");
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
  }, []);

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

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
      console.log("Deleting template with ID:", templateId);
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

  // Handle template update and propagation to courses
  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      setIsUpdating(true);
      console.log("Form submitted with data:", data);
      console.log("Form data ID:", data.id || "No ID in form data");
      
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
        
        // Log all critical fields for debugging
        console.log("ID check before update:", {
          currentTemplateId: currentTemplate.id,
          dataId: data.id,
          templateDataId: templateData.id
        });
        
        // Ensure we're using the correct ID - prioritize the ID from data if it exists, otherwise use currentTemplate.id
        const templateId = data.id || currentTemplate.id;
        
        // Make sure the ID matches what we expect
        if (!templateId) {
          throw new Error("Missing template ID for update");
        }
        
        // Ensure ID exists in templateData for the update operation
        templateData.id = templateId;
        
        console.log("Final template ID for update:", templateId);
        console.log("Final template data:", templateData);
        
        const updated = await updateCourse(templateId, templateData);
        
        if (updated) {
          // Template was updated successfully
          await loadTemplates();
          setIsFormOpen(false);
          toast.success("Template updated successfully");
          
          // Now handle propagation to courses based on sync mode
          if (templateSyncMode === 'always') {
            // Automatically propagate changes
            await propagateTemplateChanges(templateId, updated);
          } else if (templateSyncMode === 'prompt') {
            // Ask user before propagating
            const shouldPropagate = window.confirm(
              "Do you want to update all courses created from this template with the new changes?"
            );
            if (shouldPropagate) {
              await propagateTemplateChanges(templateId, updated);
            } else {
              toast.info("Courses not updated", { 
                description: "Template changes were not applied to existing courses."
              });
            }
          } else {
            // 'never' mode - don't propagate
            console.log("Template sync disabled. Not propagating changes to courses.");
          }
        } else {
          toast.error("Failed to update template", {
            description: "The update operation did not return a valid template."
          });
        }
      } else {
        console.log("Creating new template");
        const created = await createCourse(templateData);
        if (created) {
          await loadTemplates();
          setIsFormOpen(false);
          toast.success("Template created successfully");
        } else {
          toast.error("Failed to create template", {
            description: "The create operation did not return a valid template."
          });
        }
      }
    } catch (error: any) {
      console.error("Error saving template:", error);
      toast.error("Error saving template", {
        description: error?.message || "Failed to save the template"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Propagate template changes to derived courses
  const propagateTemplateChanges = async (templateId: string, templateData: Course) => {
    try {
      const updatedCount = await updateCoursesFromTemplate(templateId, templateData);
      
      if (updatedCount > 0) {
        toast.success(`Updated ${updatedCount} course${updatedCount === 1 ? '' : 's'}`, {
          description: `Changes from the template were applied to ${updatedCount} existing course${updatedCount === 1 ? '' : 's'}.`
        });
      } else {
        toast.info("No courses to update", {
          description: "No courses found that were created from this template."
        });
      }
      
      return updatedCount;
    } catch (error) {
      console.error("Error propagating template changes:", error);
      toast.error("Failed to update courses", {
        description: "There was an error applying template changes to courses."
      });
      return 0;
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
    loadTemplates,
    isUpdating,
    templateSyncMode
  };
};
