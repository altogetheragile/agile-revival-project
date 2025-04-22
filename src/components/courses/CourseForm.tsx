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
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MediaLibrary from "@/components/media/MediaLibrary";
import { useState } from "react";

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
    isTemplate: false
  },
  onSubmit,
  onCancel,
  stayOpenOnSubmit = false,
  isTemplate = false
}) => {
  const form = useForm<CourseFormData>({
    defaultValues: initialData
  });

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

  // Add status field explicitly
  const CourseStatusField = () => (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Course Status</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="draft" id="status-draft" />
                <Label htmlFor="status-draft" className="font-medium">Draft</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="published" id="status-published" />
                <Label htmlFor="status-published" className="font-medium">Published</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormDescription>
            Draft courses are only visible to administrators and can be edited. Published courses are visible to everyone.
          </FormDescription>
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicCourseFields form={form} />
        
        <CourseScheduleFields form={form} />
        <CourseInstructorPriceFields form={form} />
        <CourseCategoryFields form={form} />
        
        {/* Add explicit status field */}
        <CourseStatusField />
        
        <CourseDetailsFields form={form} />
        <CourseFormatFields form={form} />
        <LearningOutcomeField form={form} />
        <CourseGoogleDriveSection courseId={initialData?.id} />
        
        {/* Add image picker for course image */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Course Image URL
                <Button
                  className="ml-2"
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setMediaLibOpen(true)}
                >
                  Choose from Library
                </Button>
              </FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                  {field.value && (
                    <img
                      src={field.value}
                      alt="Preview"
                      className="mt-2 w-36 h-20 object-contain border rounded bg-white"
                    />
                  )}
                </div>
              </FormControl>
              <FormDescription>
                This image will be shown in course details and listings.
              </FormDescription>
              {/* Do not show FormMessage here to avoid clutter */}
            </FormItem>
          )}
        />

        <MediaLibrary
          open={mediaLibOpen}
          onOpenChange={setMediaLibOpen}
          onSelect={(url) => form.setValue("imageUrl", url, { shouldValidate: true })}
        />

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
