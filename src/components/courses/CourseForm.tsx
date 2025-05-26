
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CourseFormData } from "@/types/course";
import { BasicCourseFields } from "./form-utils/BasicCourseFields";
import { CourseScheduleFields } from "./form-utils/CourseScheduleFields";
import { CourseDetailsFields } from "./form-utils/CourseDetailsFields";
import { CourseImageField } from "./form-utils/CourseImageField";
import { CourseStatusField } from "./form-utils/CourseStatusField";
import { CourseFormActions } from "./form-utils/CourseFormActions";
import { CourseGoogleDriveSection } from "./form-utils/CourseGoogleDriveSection";
import { formatDate } from "@/lib/utils";

interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  onOpenMediaLibrary?: () => void;
  stayOpenOnSubmit?: boolean;
  isTemplate?: boolean;
  forceTemplateMode?: boolean; // New prop to force template mode
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
  isTemplate = false,
  forceTemplateMode = false, // New prop
  formData,
  setFormData,
  onPreview,
  isSubmitting = false,
  submitButtonText
}) => {
  // Determine the correct initial template mode
  const determineInitialTemplateMode = () => {
    if (forceTemplateMode) {
      console.log("CourseForm: Template mode forced to true");
      return true;
    }
    if (isTemplate) {
      console.log("CourseForm: Template mode set from isTemplate prop:", isTemplate);
      return true;
    }
    const initialMode = initialData.isTemplate || false;
    console.log("CourseForm: Template mode set from initialData:", initialMode);
    return initialMode;
  };

  const [isTemplateMode, setIsTemplateMode] = useState(determineInitialTemplateMode());
  
  const form = useForm<CourseFormData>({
    defaultValues: initialData as CourseFormData
  });

  console.log("CourseForm initialized with:", {
    isTemplate,
    forceTemplateMode,
    isTemplateMode,
    initialDataIsTemplate: initialData.isTemplate
  });

  // Update form mode when template switch changes (only if not forced)
  const handleTemplateToggle = (checked: boolean) => {
    if (forceTemplateMode) {
      console.log("CourseForm: Template toggle ignored due to forceTemplateMode");
      return; // Don't allow changes when forced
    }
    
    console.log("CourseForm: Template toggle changed to:", checked);
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
    console.log("=== CourseForm handleSubmit DEBUG START ===");
    console.log("CourseForm: Form submission started");
    console.log("CourseForm: Raw form data received:", data);
    console.log("CourseForm: forceTemplateMode:", forceTemplateMode);
    console.log("CourseForm: isTemplateMode:", isTemplateMode);
    console.log("CourseForm: data.isTemplate (from form):", data.isTemplate);
    
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
    
    // CRITICAL FIX: Determine the correct template flag
    // When forceTemplateMode is true, ALWAYS set isTemplate to true
    const finalTemplateFlag = forceTemplateMode ? true : (isTemplateMode || data.isTemplate);
    
    console.log("CourseForm: Final template flag determination:");
    console.log("  - forceTemplateMode:", forceTemplateMode);
    console.log("  - isTemplateMode:", isTemplateMode);
    console.log("  - data.isTemplate:", data.isTemplate);
    console.log("  - finalTemplateFlag:", finalTemplateFlag);
    
    // Add validation to ensure templates are not lost
    if (forceTemplateMode && !finalTemplateFlag) {
      console.error("CRITICAL ERROR: forceTemplateMode is true but finalTemplateFlag is false!");
      throw new Error("Template mode validation failed in CourseForm");
    }
    
    const finalData = {
      ...data,
      spotsAvailable: Number(data.spotsAvailable),
      isTemplate: finalTemplateFlag // Use the determined template flag
    };
    
    console.log("CourseForm: Final data being submitted:", finalData);
    console.log("CourseForm: Final data isTemplate flag:", finalData.isTemplate);
    console.log("CourseForm: Final data isTemplate type:", typeof finalData.isTemplate);
    console.log("=== CourseForm handleSubmit DEBUG END ===");
    
    onSubmit(finalData);
  };

  // Don't show the template toggle when in forced template mode
  const showTemplateToggle = !forceTemplateMode;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Template toggle switch - only show if not forced */}
        {showTemplateToggle && (
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
        )}
        
        {/* Debug info when in forced template mode */}
        {forceTemplateMode && (
          <div className="text-xs text-muted-foreground mb-2 p-2 bg-blue-50 rounded border">
            Template Management Mode - Creating/editing a reusable template
          </div>
        )}
        
        <BasicCourseFields form={form} />
        <CourseScheduleFields form={form} isTemplate={isTemplateMode} />
        <CourseDetailsFields form={form} />
        <CourseImageField form={form} onOpenMediaLibrary={onOpenMediaLibrary || (() => {})} />
        <CourseGoogleDriveSection courseId={initialData.id} />
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
