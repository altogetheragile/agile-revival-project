
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CourseForm from "@/components/courses/CourseForm";
import { CourseFormData, CourseTemplate, Course } from "@/types/course";
import CourseTemplatePreview from "./CourseTemplatePreview";
import MediaLibrary from "@/components/media/MediaLibrary";

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
  // State to track preview dialog
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<CourseTemplate | null>(null);
  
  // State for media library
  const [mediaLibOpen, setMediaLibOpen] = useState(false);
  const [formData, setFormData] = useState<CourseFormData | null>(null);

  // Convert template to course form data for editing
  const templateToCourseFormData = (template: Course): CourseFormData => {
    return {
      ...template,
      isTemplate: true
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
          <ScrollArea className="max-h-[70vh] pr-4">
            <CourseForm
              initialData={currentTemplate ? templateToCourseFormData(currentTemplate) : {
                title: "",
                description: "",
                dates: "Template - No Dates",
                location: "To Be Determined",
                instructor: "To Be Assigned",
                price: "£",
                category: "scrum",
                spotsAvailable: 0,
                isTemplate: true,
                status: "draft"
              }}
              onSubmit={onSubmit}
              onCancel={onCancel}
              stayOpenOnSubmit={true}
              isTemplate={true}
              onOpenMediaLibrary={() => setMediaLibOpen(true)}
              formData={formData}
              setFormData={setFormData}
              onPreview={handlePreview}
            />
          </ScrollArea>
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
          // Fix the type issue by providing required properties
          setFormData(prevData => ({
            ...(prevData || {}),
            title: prevData?.title || "",
            description: prevData?.description || "",
            dates: prevData?.dates || "Template - No Dates",
            location: prevData?.location || "To Be Determined",
            instructor: prevData?.instructor || "To Be Assigned",
            price: prevData?.price || "",
            category: prevData?.category || "scrum",
            spotsAvailable: prevData?.spotsAvailable || 0,
            imageUrl: url,
            imageAspectRatio: aspectRatio || "16/9",
            imageSize: size || 100,
            imageLayout: layout || "standard",
            isTemplate: true
          }));
          setMediaLibOpen(false);
        }}
      />
    </>
  );
};
