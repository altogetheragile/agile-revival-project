
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CourseForm from "@/components/courses/CourseForm";
import { CourseFormData, CourseTemplate } from "@/types/course";

interface ScheduleCourseFromTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: CourseTemplate | null;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
}

export const ScheduleCourseFromTemplateDialog: React.FC<ScheduleCourseFromTemplateDialogProps> = ({
  open,
  onOpenChange,
  template,
  onSubmit,
  onCancel
}) => {
  // Convert template to course form data for scheduling
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
      isTemplate: false
    };
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Schedule Course: {template.title}</DialogTitle>
          <DialogDescription>
            Create a new course instance from this template by adding dates, location, and instructor details.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <CourseForm
            initialData={templateToCourseFormData(template)}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
