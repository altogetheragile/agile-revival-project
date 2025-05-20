
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CourseForm from "@/components/courses/CourseForm";
import { Course, CourseFormData, ScheduleCourseFormData } from "@/types/course";
import { useScheduleCourse } from "@/hooks/useScheduleCourse";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScheduleCourseFromTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Course | null;
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
  const [formData, setFormData] = useState<CourseFormData | null>(null);
  const { scheduleCourse, isScheduling } = useScheduleCourse(() => {
    onOpenChange(false);
  });

  // Event type display label
  const getEventTypeLabel = (eventType: string = "course") => {
    const types: Record<string, string> = {
      "course": "Course",
      "workshop": "Workshop",
      "webinar": "Webinar",
      "conference": "Conference",
      "meetup": "Meetup"
    };
    return types[eventType.toLowerCase()] || "Event";
  };

  // Get badge color based on event type
  const getEventTypeColor = (eventType: string = "course") => {
    switch (eventType.toLowerCase()) {
      case "course":
        return "bg-blue-100 text-blue-800";
      case "workshop":
        return "bg-purple-100 text-purple-800";
      case "webinar":
        return "bg-amber-100 text-amber-800";
      case "conference":
        return "bg-green-100 text-green-800";
      case "meetup":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const prepareFormData = (): CourseFormData => {
    if (!template) {
      return {
        title: "",
        description: "",
        dates: "",
        location: "",
        instructor: "",
        price: "",
        category: "",
        eventType: "course",
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
      price: template.price || "",
      category: template.category || "",
      eventType: template.eventType || "course",
      spotsAvailable: 12,
      learningOutcomes: template.learningOutcomes || [],
      prerequisites: template.prerequisites || null,
      targetAudience: template.targetAudience || null,
      duration: template.duration || "",
      skillLevel: template.skillLevel || "all-levels",
      format: template.format || "in-person",
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
      const scheduleData: ScheduleCourseFormData = {
        templateId: template.id,
        dates: data.dates || "",
        location: data.location || "",
        instructor: data.instructor || "",
        spotsAvailable: Number(data.spotsAvailable || 0),
        status: data.status || "draft",
        title: data.title,
        description: data.description,
        eventType: data.eventType,
        price: data.price,
        category: data.category,
        isTemplate: false
      };
      
      await scheduleCourse(template.id, scheduleData);
    }
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>
              Schedule New {template ? getEventTypeLabel(template.eventType) : "Event"}
            </DialogTitle>
            {template?.eventType && (
              <Badge variant="outline" className={getEventTypeColor(template.eventType)}>
                {getEventTypeLabel(template.eventType)}
              </Badge>
            )}
          </div>
          <DialogDescription>
            {template ? `Create a new scheduled instance of "${template.title}"` : "Schedule a new event instance from this template."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <CourseForm
            initialData={prepareFormData()}
            onSubmit={handleFormSubmit}
            onCancel={onCancel}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isScheduling}
            submitButtonText={isScheduling ? 
              <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Scheduling...</> : 
              `Schedule ${template ? getEventTypeLabel(template.eventType) : "Event"}`
            }
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
