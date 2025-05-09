
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import EventForm from "@/components/events/EventForm";
import { Event, EventFormData } from "@/types/event";
import { useScheduleEvent } from "@/hooks/useScheduleEvent";

interface ScheduleEventFromTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Event | null;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  onOpenMediaLibrary?: () => void;
}

export const ScheduleEventFromTemplateDialog: React.FC<ScheduleEventFromTemplateDialogProps> = ({
  open,
  onOpenChange,
  template,
  onSubmit,
  onCancel,
  onOpenMediaLibrary
}) => {
  const [formData, setFormData] = useState<EventFormData | null>(null);
  const { scheduleEvent, isScheduling } = useScheduleEvent(() => {
    onOpenChange(false);
  });

  const prepareEventData = (): EventFormData => {
    if (!template) {
      return {
        title: "",
        description: "",
        dates: "",
        location: "",
        instructor: "",
        price: "",
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

  const handleFormSubmit = async (data: EventFormData) => {
    if (template) {
      await scheduleEvent(template.id, {
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
            {template ? `Schedule Event: ${template.title}` : "Schedule New Event"}
          </DialogTitle>
          <DialogDescription>
            Schedule a new event instance from this template.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <EventForm
            initialData={prepareEventData()}
            onSubmit={handleFormSubmit}
            onCancel={onCancel}
            onOpenMediaLibrary={onOpenMediaLibrary}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
