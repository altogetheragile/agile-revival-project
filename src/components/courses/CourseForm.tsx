
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
    isTemplate: false,
    imageAspectRatio: "16/9",
    imageSize: 100,
    imageLayout: "standard"
  },
  onSubmit,
  onCancel,
  onOpenMediaLibrary,
  stayOpenOnSubmit = false,
  formData,
  setFormData,
  onPreview,
  isSubmitting = false,
  submitButtonText
}) => {
  const [isTemplateMode, setIsTemplateMode] = useState(initialData.isTemplate || false);
  const form = useForm<CourseFormData>({
    defaultValues: initialData as CourseFormData
  });

  // Update form mode when template switch changes
  const handleTemplateToggle = (checked: boolean) => {
    setIsTemplateMode(checked);
    form.setValue("isTemplate", checked);
    
    // Set default values appropriate for templates or scheduled events
    if (checked) {
      form.setValue("location", "To Be Determined");
      form.setValue("instructor", "To Be Assigned");
      form.setValue("spotsAvailable", 0);
    } else {
      // Only reset these if they have template default values
      if (form.getValues("location") === "To Be Determined") {
        form.setValue("location", "");
      }
      if (form.getValues("instructor") === "To Be Assigned") {
        form.setValue("instructor", "");
      }
      if (form.getValues("spotsAvailable") === 0) {
        form.setValue("spotsAvailable", 12);
      }
    }
  };

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
      spotsAvailable: Number(data.spotsAvailable),
      isTemplate: isTemplateMode
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Template toggle switch */}
        <div className="flex items-center space-x-2 mb-6 pb-4 border-b">
          <Switch 
            id="template-mode" 
            checked={isTemplateMode}
            onCheckedChange={handleTemplateToggle}
          />
          <Label htmlFor="template-mode" className="font-medium">
            {isTemplateMode ? "Template Mode" : "Scheduled Event Mode"}
          </Label>
          <p className="ml-4 text-sm text-muted-foreground">
            {isTemplateMode 
              ? "Creating a reusable template for future events" 
              : "Creating a specific scheduled event"
            }
          </p>
        </div>
        
        <BasicCourseFields form={form} />
        <CourseScheduleFields form={form} isTemplate={isTemplateMode} />
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
          customSubmitText={submitButtonText || (isTemplateMode ? "Save Template" : "Save Event")}
        />
      </form>
    </Form>
  );
};

export default CourseForm;
