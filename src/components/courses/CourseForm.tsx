
import React from "react";
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

interface CourseFormProps {
  initialData?: CourseFormData;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  stayOpenOnSubmit?: boolean;
  isTemplate?: boolean;
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
    isTemplate: true
  },
  onSubmit,
  onCancel,
  stayOpenOnSubmit = false,
  isTemplate = true
}) => {
  const form = useForm<CourseFormData>({
    defaultValues: initialData
  });

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
        
        {!isTemplate && (
          <>
            <CourseScheduleFields form={form} />
            <CourseInstructorPriceFields form={form} />
          </>
        )}
        
        {isTemplate && (
          <CourseInstructorPriceFields form={form} />
        )}
        
        <CourseCategoryFields form={form} />
        <CourseDetailsFields form={form} />
        <CourseFormatFields form={form} />
        <LearningOutcomeField form={form} />
        <CourseGoogleDriveSection courseId={initialData?.id} />
        
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

export default CourseForm;
