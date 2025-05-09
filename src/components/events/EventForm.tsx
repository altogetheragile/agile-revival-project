
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { EventFormData } from "@/types/event";
import { BasicEventFields } from "./form-utils/BasicEventFields";
import { ScheduleFields } from "./form-utils/ScheduleFields";
import { EventDetailsFields } from "./form-utils/EventDetailsFields";
import { AdditionalInfoFields } from "./form-utils/AdditionalInfoFields";
import { EventImageField } from "./form-utils/EventImageField";
import { EventStatusField } from "./form-utils/EventStatusField";
import { EventFormActions } from "./form-utils/EventFormActions";

interface EventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  onOpenMediaLibrary?: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData = {
    title: "",
    description: "",
    dates: "",
    location: "",
    instructor: "",
    price: "£",
    category: "workshop",
    spotsAvailable: 12,
    learningOutcomes: [],
    prerequisites: "",
    targetAudience: "",
    duration: "",
    skillLevel: "all-levels",
    format: "in-person",
    status: "draft",
    imageAspectRatio: "16/9",
    imageSize: 100,
    imageLayout: "standard"
  },
  onSubmit,
  onCancel,
  onOpenMediaLibrary
}) => {
  const form = useForm<EventFormData>({
    defaultValues: initialData
  });

  const handleSubmit = (data: EventFormData) => {
    // Process learning outcomes if provided as a string
    if (typeof data.learningOutcomes === 'string') {
      data.learningOutcomes = data.learningOutcomes
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    
    onSubmit({
      ...data,
      spotsAvailable: Number(data.spotsAvailable)
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicEventFields form={form} />
        <ScheduleFields form={form} />
        <EventDetailsFields form={form} />
        <AdditionalInfoFields form={form} />
        <EventImageField form={form} onOpenMediaLibrary={onOpenMediaLibrary} />
        <EventStatusField form={form} />
        <EventFormActions 
          onCancel={onCancel} 
          isEditing={!!initialData.id} 
        />
      </form>
    </Form>
  );
};

export default EventForm;
