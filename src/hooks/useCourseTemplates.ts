
import { useState, useEffect, useCallback } from 'react';
import { Course, CourseFormData } from '@/types/course';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getCourseTemplates } from '@/services/course/courseQueries';
import { createCourse, updateCourse, deleteCourse } from '@/services/course/courseMutations';
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
    console.log("Template ID being set:", template.id);
    setCurrentTemplate(template);
    setIsFormOpen(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      console.log("Deleting template with ID:", templateId);
      
      // Confirm deletion with the user
      if (!window.confirm("Are you sure you want to delete this template? This cannot be undone.")) {
        console.log("Template deletion cancelled by user");
        return;
      }
      
      const success = await deleteCourse(templateId);
      console.log("Delete operation result:", success);
      
      if (success) {
        // Only reload templates if deletion was successful
        await loadTemplates();
        toast.success("Template deleted successfully");
      } else {
        toast.error("Failed to delete template", {
          description: "The operation did not complete successfully"
        });
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
  const handleFormSubmit = async (data: CourseFormData, propagateChanges: boolean = false) => {
    try {
      setIsUpdating(true);
      console.log("Form submitted with data:", data);
      console.log("Form data ID:", data.id || "No ID in form data");
      console.log("Propagate changes flag:", propagateChanges);
      
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
        console.log("Calling updateCourse with ID:", templateId);
        console.log("Propagate changes:", propagateChanges);
        
        // Pass explicit propagateChanges parameter to updateCourse
        const updated = await updateCourse(templateId, templateData, propagateChanges);
        
        if (updated) {
          // Template was updated successfully
          await loadTemplates();
          setIsFormOpen(false);
          // Toast is handled in updateCourse with details about propagation
        } else {
          console.error("Update operation returned null");
          toast.error("Failed to update template", {
            description: "The update operation did not return a valid template"
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
          console.error("Create operation returned null");
          toast.error("Failed to create template", {
            description: "The create operation did not return a valid template"
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
