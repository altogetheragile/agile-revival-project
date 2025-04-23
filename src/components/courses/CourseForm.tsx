
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { CourseFormData } from "@/types/course";
import { BasicCourseFields } from "./form-utils/BasicCourseFields";
import { CourseCategoryFields } from "./form-utils/CourseCategoryFields";
import { CourseDetailsFields } from "./form-utils/CourseDetailsFields";
import { LearningOutcomeField } from "./form-utils/LearningOutcomeField";
import { CourseFormActions } from "./form-utils/CourseFormActions";
import { CourseFormatFields } from "./form-utils/CourseFormatFields";
import { CourseGoogleDriveSection } from "./form-utils/CourseGoogleDriveSection";
import { CourseInstructorPriceFields } from "./form-utils/CourseInstructorPriceFields";
import { CourseScheduleFields } from "./form-utils/CourseScheduleFields";
import { CourseStatusField } from "./form-utils/CourseStatusField";
import { CourseImageField } from "./form-utils/CourseImageField";
import MediaLibrary from "@/components/media/MediaLibrary";
import { useState, Dispatch, SetStateAction } from "react";

interface CourseFormProps {
  initialData?: CourseFormData;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  stayOpenOnSubmit?: boolean;
  isTemplate?: boolean;
  // Media library integration props
  onOpenMediaLibrary?: () => void;
  formData?: CourseFormData | null;
  setFormData?: Dispatch<SetStateAction<CourseFormData | null>>;
}

const CourseForm: React.FC<CourseFormProps> = ({
  initialData = {
    title: "",
    description: "",
    dates: "",
    location: "London", // Default to London
    instructor: "Alun Davies-Baker", // Default instructor
    price: "£", // Default price currency symbol
    category: "scrum",
    spotsAvailable: 12, // Default available spots
    learningOutcomes: [],
    prerequisites: "",
    targetAudience: "",
    duration: "",
    skillLevel: "all-levels",
    format: "in-person",
    status: "draft",
    imageAspectRatio: "16/9",
    isTemplate: false
  },
  onSubmit,
  onCancel,
  stayOpenOnSubmit = false,
  isTemplate = false,
  onOpenMediaLibrary,
  formData,
  setFormData
}) => {
  // Initialize the form with either formData (if provided) or initialData
  const form = useForm<CourseFormData>({
    defaultValues: formData || initialData
  });

  // Update form values when formData changes (e.g., when image is selected from media library)
  useEffect(() => {
    if (formData) {
      // Reset the form with the new data, including the imageUrl
      Object.entries(formData).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });
      console.log("Form values updated from formData:", formData);
    }
  }, [formData, form]);

  const [mediaLibOpen, setMediaLibOpen] = useState(false);

  const handleSubmit = (data: CourseFormData) => {
    // Process learning outcomes if provided as a string
    if (typeof data.learningOutcomes === 'string') {
      data.learningOutcomes = data.learningOutcomes
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    
    onSubmit({
      ...data,
      spotsAvailable: Number(data.spotsAvailable),
      isTemplate: isTemplate
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicCourseFields form={form} />
        <CourseScheduleFields form={form} />
        <CourseInstructorPriceFields form={form} />
        <CourseCategoryFields form={form} />
        <CourseStatusField form={form} />
        <CourseDetailsFields form={form} />
        <CourseFormatFields form={form} />
        <LearningOutcomeField form={form} />
        <CourseGoogleDriveSection courseId={initialData?.id} />
        
        <CourseImageField 
          form={form}
          onOpenMediaLibrary={onOpenMediaLibrary || (() => setMediaLibOpen(true))}
        />

        {!onOpenMediaLibrary && (
          <MediaLibrary
            open={mediaLibOpen}
            onOpenChange={setMediaLibOpen}
            onSelect={(url, aspectRatio) => {
              form.setValue("imageUrl", url, { shouldValidate: true });
              form.setValue("imageAspectRatio", aspectRatio || "16/9", { shouldValidate: false });
              console.log("Direct form update with URL:", url, "and ratio:", aspectRatio);
              setMediaLibOpen(false);
            }}
          />
        )}

        <CourseFormActions 
          onCancel={onCancel} 
          isEditing={!!initialData.id}
          isDraft={form.watch("status") === "draft"}
          stayOpenOnSubmit={stayOpenOnSubmit}
        />
      </form>
    </Form>
  );
};
