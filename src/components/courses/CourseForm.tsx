
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { CourseFormData } from "@/types/course";
import { BasicCourseFields } from "./form-utils/BasicCourseFields";
import { CourseScheduleFields } from "./form-utils/CourseScheduleFields";
import { CourseDetailsFields } from "./form-utils/CourseDetailsFields";
import { AdditionalInfoFields } from "./form-utils/AdditionalInfoFields";
import { CourseImageField } from "./form-utils/CourseImageField";
import { CourseStatusField } from "./form-utils/CourseStatusField";
import { CourseFormActions } from "./form-utils/CourseFormActions";
import { formatDate } from "@/lib/utils";

interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  onOpenMediaLibrary?: () => void;
  stayOpenOnSubmit?: boolean;
  isTemplate?: boolean;
  formData?: CourseFormData | null;
  setFormData?: React.Dispatch<React.SetStateAction<CourseFormData | null>>;
  onPreview?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: React.ReactNode;
}

const CourseForm: React.FC<CourseFormProps> = ({
  initialData = {
    title: "",
    description: "",
    startDate: null,
    endDate: null,
    location: "",
    instructor: "",
    price: "£",
    eventType: "course", // Default event type
    category: "programming", // Default category
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
  onOpenMediaLibrary,
  stayOpenOnSubmit = false,
  isTemplate = false,
  formData,
  setFormData,
  onPreview,
  isSubmitting = false,
  submitButtonText
}) => {
  const form = useForm<CourseFormData>({
    defaultValues: initialData as CourseFormData
  });

  const handleSubmit = (data: CourseFormData) => {
    // Process learning outcomes if provided as a string
    if (typeof data.learningOutcomes === 'string') {
      data.learningOutcomes = data.learningOutcomes
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    
    // Generate dates field for backward compatibility if startDate and endDate are provided
    if (data.startDate && data.endDate) {
      const startDateStr = formatDate(data.startDate);
      const endDateStr = formatDate(data.endDate);
      data.dates = startDateStr === endDateStr ? startDateStr : `${startDateStr} - ${endDateStr}`;
    }
    
    onSubmit({
      ...data,
      spotsAvailable: Number(data.spotsAvailable)
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicCourseFields form={form} />
        <CourseScheduleFields form={form} />
        <CourseDetailsFields form={form} />
        <AdditionalInfoFields form={form} />
        <CourseImageField form={form} onOpenMediaLibrary={onOpenMediaLibrary || (() => {})} />
        <CourseStatusField form={form} />
        <CourseFormActions 
          onCancel={onCancel} 
          isEditing={!!initialData.id}
          isDraft={initialData.status === "draft"} 
          onPreview={onPreview}
          isSubmitting={isSubmitting}
          customSubmitText={submitButtonText}
        />
      </form>
    </Form>
  );
};

export default CourseForm;
