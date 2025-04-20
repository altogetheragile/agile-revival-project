
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CourseForm from "@/components/courses/CourseForm";
import { CourseFormData, CourseTemplate } from "@/types/course";

interface CourseTemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTemplate: CourseTemplate | null;
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
  // Convert template to course form data for editing
  const templateToCourseFormData = (template: CourseTemplate): CourseFormData => {
    return {
      title: template.title,
      description: template.description,
      category: template.category,
      price: template.price,
      dates: "",
      location: "",
      instructor: "",
      spotsAvailable: 12,
      learningOutcomes: template.learningOutcomes,
      prerequisites: template.prerequisites,
      targetAudience: template.targetAudience,
      duration: template.duration,
      skillLevel: template.skillLevel,
      format: template.format,
      status: template.status,
      templateId: template.id,
      isTemplate: true
    };
  };

  return (
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
              dates: "",
              location: "",
              instructor: "",
              price: "£",
              category: "scrum",
              spotsAvailable: 12,
              isTemplate: true,
              status: "draft"
            }}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

