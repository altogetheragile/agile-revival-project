
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { CourseFormData } from "@/types/course";
import { BasicCourseFields } from "./form-utils/BasicCourseFields";
import { CourseScheduleFields } from "./form-utils/CourseScheduleFields";
import { CourseInstructorPriceFields } from "./form-utils/CourseInstructorPriceFields";
import { CourseCategoryFields } from "./form-utils/CourseCategoryFields";
import { CourseDetailsFields } from "./form-utils/CourseDetailsFields";
import { LearningOutcomeField } from "./form-utils/LearningOutcomeField";
import { CourseFormActions } from "./form-utils/CourseFormActions";
import { CourseFormatFields } from "./form-utils/CourseFormatFields";
import { CourseMaterialsUpload } from "./form-utils/CourseMaterialsUpload";

interface CourseFormProps {
  initialData?: CourseFormData;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  initialData = {
    title: "",
    description: "",
    dates: "",
    location: "",
    instructor: "",
    price: "",
    category: "scrum",
    spotsAvailable: 10,
    learningOutcomes: [],
    prerequisites: "",
    targetAudience: "",
    duration: "",
    skillLevel: "all-levels",
    format: "in-person",
    status: "draft"
  },
  onSubmit,
  onCancel
}) => {
  const form = useForm<CourseFormData>({
    defaultValues: initialData
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Convert comma-separated string to array for learning outcomes
  const handleSubmit = (data: CourseFormData) => {
    // Process learning outcomes if provided as a string
    if (typeof data.learningOutcomes === 'string') {
      data.learningOutcomes = data.learningOutcomes
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    
    // Add uploaded files to the form data
    data.materials = uploadedFiles;
    
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
        <CourseInstructorPriceFields form={form} />
        <CourseCategoryFields form={form} />
        <CourseDetailsFields form={form} />
        <CourseFormatFields form={form} />
        <LearningOutcomeField form={form} />
        <CourseMaterialsUpload 
          onFilesChange={setUploadedFiles} 
          files={uploadedFiles}
        />
        <CourseFormActions 
          onCancel={onCancel} 
          isEditing={!!initialData.id}
          isDraft={form.watch("status") === "draft"}
        />
      </form>
    </Form>
  );
};

export default CourseForm;
