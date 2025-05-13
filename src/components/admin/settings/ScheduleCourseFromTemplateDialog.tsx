
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CourseForm from "@/components/courses/CourseForm";
import { Course, CourseFormData } from "@/types/course";
import { useScheduleCourse } from "@/hooks/useScheduleCourse";

interface ScheduleCourseFromTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Course | null;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  onOpenMediaLibrary?: () => void;
}

export const ScheduleCourseFromTemplateDialog: React.FC<ScheduleCourseFromTemplateDialogProps> = ({
  open,
  onOpenChange,
  template,
  onSubmit,
  onCancel,
  onOpenMediaLibrary
}) => {
  const [formData, setFormData] = useState<CourseFormData | null>(null);
  const { scheduleCourse, isScheduling } = useScheduleCourse(() => {
    onOpenChange(false);
  });

  const prepareCourseData = (): CourseFormData => {
    if (!template) {
      return {
        title: "",
        description: "",
        dates: "",
        location: "",
        instructor: "",
        price: "",
        eventType: "course", // Default event type
        category: "",
        spotsAvailable: 0,
        isTemplate: false,
        status: "draft"
      };
    }

    return {
      title: template.title,
      description: template.description,
      dates: "",
      location: template.location && template.location !== "To Be Determined" ? template.location : "",
      instructor: template.instructor && template.instructor !== "To Be Assigned" ? template.instructor : "",
      price: template.price,
      eventType: template.eventType || "course", // Use the template's event type
      category: template.category,
      spotsAvailable: 12,
      learningOutcomes: template.learningOutcomes,
      prerequisites: template.prerequisites,
      targetAudience: template.targetAudience,
      duration: template.duration,
      skillLevel: template.skillLevel,
      format: template.format,
      status: "draft",
      imageUrl: template.imageUrl,
      imageAspectRatio: template.imageAspectRatio,
      imageSize: template.imageSize,
      imageLayout: template.imageLayout,
      isTemplate: false,
      templateId: template.id
    };
  };

  const handleFormSubmit = async (data: CourseFormData) => {
    if (template) {
      await scheduleCourse(template.id, {
        dates: data.dates || "",
        location: data.location || "",
        instructor: data.instructor || "",
        spotsAvailable: Number(data.spotsAvailable || 0),
        status: data.status || "draft",
        templateId: template.id
      });
    }
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {template ? `Schedule Course: ${template.title}` : "Schedule New Course"}
          </DialogTitle>
          <DialogDescription>
            Schedule a new course instance from this template.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <CourseForm
            initialData={prepareCourseData()}
            onSubmit={handleFormSubmit}
            onCancel={onCancel}
            onOpenMediaLibrary={onOpenMediaLibrary}
            formData={formData}
            setFormData={setFormData}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleCourseFromTemplateDialog;
