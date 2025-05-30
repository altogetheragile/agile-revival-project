
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
import { Checkbox } from "@/components/ui/checkbox";

interface CourseTemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTemplate: Course | null;
  onSubmit: (data: CourseFormData, propagateChanges?: boolean) => void;
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

  // State for propagation option - with user preference persistence
  const [propagateChanges, setPropagateChanges] = useState<boolean>(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem("propagateChanges");
    return saved === "true";
  });

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
    console.log("Template isTemplate value:", template.isTemplate);
    
    const formData = {
      id: template.id, // Explicitly include ID to ensure it's preserved
      title: template.title,
      description: template.description,
      dates: template.dates || "Template - No Dates",
      startDate: template.startDate || null,
      endDate: template.endDate || null,
      location: template.location || "To Be Determined",
      instructor: template.instructor || "To Be Assigned",
      price: template.price || "",
      category: template.category || "",
      eventType: template.eventType || "course",
      format: template.format || "in-person",
      skillLevel: template.skillLevel || "all-levels",
      spotsAvailable: template.spotsAvailable || 0,
      isTemplate: true, // Always ensure this is set to true for templates
      status: template.status || "draft", // Ensure status is always provided
      imageUrl: template.imageUrl || "",
      imageAspectRatio: template.imageAspectRatio || "16/9",
      imageSize: template.imageSize || 100,
      imageLayout: template.imageLayout || "standard",
      learningOutcomes: template.learningOutcomes || [],
      prerequisites: template.prerequisites || null,
      targetAudience: template.targetAudience || null,
      duration: template.duration || "",
      googleDriveFolderId: template.googleDriveFolderId || null,
      googleDriveFolderUrl: template.googleDriveFolderUrl || null
    };
    
    console.log("Converted form data:", formData);
    console.log("Form data isTemplate:", formData.isTemplate);
    return formData;
  };

  // Initialize form data when currentTemplate changes
  useEffect(() => {
    if (currentTemplate) {
      console.log("Setting initial form data with template ID:", currentTemplate.id);
      console.log("Current template isTemplate:", currentTemplate.isTemplate);
      setFormData(templateToCourseFormData(currentTemplate));
    } else {
      // Clear form data when creating a new template
      setFormData(null);
    }
  }, [currentTemplate]);

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
      learningOutcomes: normalizeLearningOutcomes(
        (formValues.namedItem('learningOutcomes') as HTMLTextAreaElement)?.value
      ),
      prerequisites: (formValues.namedItem('prerequisites') as HTMLTextAreaElement)?.value || null,
      targetAudience: (formValues.namedItem('targetAudience') as HTMLTextAreaElement)?.value || null,
      duration: (formValues.namedItem('duration') as HTMLInputElement)?.value || '',
      skillLevel: (formValues.namedItem('skillLevel') as HTMLSelectElement)?.value as any || 'all-levels',
      format: (formValues.namedItem('format') as HTMLSelectElement)?.value || '',
      status: 'draft',
      imageUrl: (formValues.namedItem('imageUrl') as HTMLInputElement)?.value || '',
      imageAspectRatio: currentTemplate?.imageAspectRatio || "16/9",
      imageSize: currentTemplate?.imageSize || 100,
      imageLayout: currentTemplate?.imageLayout || "standard",
      spotsAvailable: parseInt((formValues.namedItem('spotsAvailable') as HTMLInputElement)?.value || '0', 10) || 0,
      isTemplate: true
    };
    
    setPreviewData(previewTemplate);
    setPreviewOpen(true);
  };

  // Handle form submission with additional error handling and debugging
  const handleSubmit = async (data: CourseFormData) => {
    console.log("=== CourseTemplateFormDialog handleSubmit DEBUG START ===");
    console.log("CourseTemplateFormDialog: Form submission started");
    console.log("CourseTemplateFormDialog: Data received:", data);
    console.log("CourseTemplateFormDialog: isTemplate flag:", data.isTemplate);
    console.log("CourseTemplateFormDialog: typeof isTemplate:", typeof data.isTemplate);
    
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
    
    // Explicitly preserve the template ID when editing and ensure isTemplate is true
    const templateData = {
      ...data,
      isTemplate: true, // Force this to true for templates - CRITICAL FIX
    };
    
    console.log("CourseTemplateFormDialog: templateData after forcing isTemplate:", templateData);
    console.log("CourseTemplateFormDialog: templateData.isTemplate:", templateData.isTemplate);
    
    if (currentTemplate) {
      console.log("CourseTemplateFormDialog: Editing existing template with ID:", currentTemplate.id);
      
      // Ensure we're using the template ID
      if (!templateData.id && currentTemplate.id) {
        console.log("CourseTemplateFormDialog: Setting missing ID from currentTemplate");
        templateData.id = currentTemplate.id;
      }
      
      console.log("CourseTemplateFormDialog: Calling onSubmit with template data, ID check:", templateData.id);
      console.log("CourseTemplateFormDialog: Propagation setting:", propagateChanges);
      console.log("CourseTemplateFormDialog: Final isTemplate flag:", templateData.isTemplate);
    } else {
      console.log("CourseTemplateFormDialog: Creating new template (no ID yet)");
      console.log("CourseTemplateFormDialog: Final isTemplate flag:", templateData.isTemplate);
      // Ensure no ID is set for new templates
      delete templateData.id;
    }
    
    console.log("CourseTemplateFormDialog: About to call onSubmit with final templateData:", templateData);
    console.log("=== CourseTemplateFormDialog handleSubmit DEBUG END ===");
    
    try {
      // Pass the propagation flag to onSubmit
      onSubmit(templateData, propagateChanges);
    } catch (error) {
      console.error("CourseTemplateFormDialog: Error submitting template:", error);
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
              {/* Debug ID display */}
              {currentTemplate && (
                <div className="text-xs text-muted-foreground mb-2 p-1 bg-muted rounded">
                  Editing template ID: {currentTemplate.id}
                </div>
              )}
              
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
                forceTemplateMode={true} // Force template mode to prevent user changes
                onOpenMediaLibrary={() => setMediaLibOpen(true)}
                formData={formData}
                setFormData={setFormData}
                onPreview={handlePreview}
              />
              
              {/* Propagation checkbox */}
              {currentTemplate && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="propagate-changes"
                      checked={propagateChanges}
                      onCheckedChange={(checked) => {
                        const newValue = checked === true;
                        setPropagateChanges(newValue);
                        localStorage.setItem("propagateChanges", newValue.toString());
                      }} 
                    />
                    <label 
                      htmlFor="propagate-changes" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Update all scheduled courses from this template
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">
                    This will update title, description, content fields, and imagery for all courses created from this template.
                  </p>
                </div>
              )}
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

function normalizeLearningOutcomes(input: string): string[] {
  return input?.split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.trim()) || [];
}
