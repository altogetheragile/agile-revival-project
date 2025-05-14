
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CourseForm from "@/components/courses/CourseForm";
import { CourseFormData, CourseTemplate, Course } from "@/types/course";
import CourseTemplatePreview from "./CourseTemplatePreview";
import MediaLibrary from "@/components/media/MediaLibrary";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface CourseTemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTemplate: Course | null;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
}

export const CourseTemplateFormDialog: React.FC<CourseTemplateFormDialogProps> = ({
  open,
  onOpenChange,
  currentTemplate,
  onSubmit,
  onCancel
}) => {
  // Get auth state
  const { user, isAdmin } = useAuth();
  
  // State to track preview dialog
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<CourseTemplate | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // State for media library
  const [mediaLibOpen, setMediaLibOpen] = useState(false);
  const [formData, setFormData] = useState<CourseFormData | null>(null);

  // Check authentication status when dialog opens
  useEffect(() => {
    if (open) {
      if (!user) {
        setAuthError("You must be logged in to manage templates");
      } else if (!isAdmin) {
        setAuthError("You need admin privileges to manage templates");
      } else {
        setAuthError(null);
        // Verify we have a valid session
        supabase.auth.getSession().then(({ data: { session }}) => {
          if (!session) {
            setAuthError("Your session has expired. Please log in again.");
            toast.error("Session expired", {
              description: "Please log in again to continue"
            });
          }
        });
      }
    }
  }, [open, user, isAdmin]);

  // Convert template to course form data for editing
  const templateToCourseFormData = (template: Course): CourseFormData => {
    console.log("Converting template to form data:", template);
    console.log("Template ID being preserved:", template.id); // Add explicit logging for ID
    return {
      ...template,
      id: template.id, // Explicitly include ID to ensure it's preserved
      isTemplate: true, // Always ensure this is set to true for templates
      // Provide defaults for required fields
      dates: template.dates || "Template - No Dates",
      location: template.location || "To Be Determined",
      instructor: template.instructor || "To Be Assigned",
      spotsAvailable: template.spotsAvailable || 0
    };
  };

  // Handle preview request
  const handlePreview = () => {
    // Get current form values
    const formValues = document.querySelector('form')?.elements;
    if (!formValues) return;
    
    // Create a preview template from the current form values
    const previewTemplate: CourseTemplate = {
      id: currentTemplate?.id || 'preview-template',
      title: (formValues.namedItem('title') as HTMLInputElement)?.value || 'Untitled Course',
      description: (formValues.namedItem('description') as HTMLTextAreaElement)?.value || '',
      eventType: (formValues.namedItem('eventType') as HTMLSelectElement)?.value || 'course',
      category: (formValues.namedItem('category') as HTMLInputElement)?.value || '',
      price: (formValues.namedItem('price') as HTMLInputElement)?.value || '',
      learningOutcomes: (formValues.namedItem('learningOutcomes') as HTMLTextAreaElement)?.value
        .split('\n')
        .filter(line => line.trim().length > 0),
      prerequisites: (formValues.namedItem('prerequisites') as HTMLTextAreaElement)?.value || '',
      targetAudience: (formValues.namedItem('targetAudience') as HTMLTextAreaElement)?.value || '',
      duration: (formValues.namedItem('duration') as HTMLInputElement)?.value || '',
      skillLevel: (formValues.namedItem('skillLevel') as HTMLSelectElement)?.value as any || 'all-levels',
      format: (formValues.namedItem('format') as HTMLSelectElement)?.value || '',
      status: 'draft',
      imageUrl: (formValues.namedItem('imageUrl') as HTMLInputElement)?.value || '',
      imageAspectRatio: currentTemplate?.imageAspectRatio || "16/9",
      imageSize: currentTemplate?.imageSize || 100,
      imageLayout: currentTemplate?.imageLayout || "standard"
    };
    
    setPreviewData(previewTemplate);
    setPreviewOpen(true);
  };

  // Handle form submission with additional error handling
  const handleSubmit = async (data: CourseFormData) => {
    // Double check authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !user) {
      toast.error("Authentication required", {
        description: "You need to be logged in to save templates"
      });
      return;
    }
    
    if (!isAdmin) {
      toast.error("Permission denied", {
        description: "You need admin privileges to save templates"
      });
      return;
    }
    
    // Explicitly preserve the template ID when editing
    const templateData = {
      ...data,
      isTemplate: true,
    };
    
    if (currentTemplate) {
      console.log("Editing existing template with ID:", currentTemplate.id);
      templateData.id = currentTemplate.id;
    } else {
      console.log("Creating new template (no ID yet)");
    }
    
    console.log("Submitting template data with ID check:", templateData.id);
    
    try {
      onSubmit(templateData);
    } catch (error) {
      console.error("Error submitting template:", error);
      toast.error("Failed to save template", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {currentTemplate ? `Edit Template: ${currentTemplate.title}` : "Add New Course Template"}
            </DialogTitle>
            <DialogDescription>
              Define the course details that will be used as a template for scheduling course instances.
            </DialogDescription>
          </DialogHeader>
          
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          {!authError && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <CourseForm
                initialData={currentTemplate ? templateToCourseFormData(currentTemplate) : {
                  title: "",
                  description: "",
                  dates: "Template - No Dates",
                  location: "To Be Determined",
                  instructor: "To Be Assigned",
                  price: "£",
                  eventType: "course", // Default event type
                  category: "scrum",
                  spotsAvailable: 0,
                  isTemplate: true, // Explicitly set isTemplate to true
                  status: "draft"
                }}
                onSubmit={handleSubmit}
                onCancel={onCancel}
                isTemplate={true} // Always pass isTemplate as true
                onOpenMediaLibrary={() => setMediaLibOpen(true)}
                formData={formData}
                setFormData={setFormData}
                onPreview={handlePreview}
              />
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
      
      <CourseTemplatePreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        template={previewData}
      />

      <MediaLibrary
        open={mediaLibOpen}
        onOpenChange={setMediaLibOpen}
        onSelect={(url, aspectRatio, size, layout) => {
          setFormData(prevData => ({
            ...(prevData || {
              title: "",
              description: "",
              dates: "Template - No Dates",
              location: "To Be Determined",
              instructor: "To Be Assigned",
              price: "£",
              eventType: "course", // Default event type
              category: "scrum",
              spotsAvailable: 0,
              isTemplate: true,
              status: "draft"
            }),
            imageUrl: url,
            imageAspectRatio: aspectRatio || "16/9",
            imageSize: size || 100,
            imageLayout: layout || "standard"
          }));
          setMediaLibOpen(false);
        }}
      />
    </>
  );
};
