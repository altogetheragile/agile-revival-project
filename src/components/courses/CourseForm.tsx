import React, { useState, useEffect } from "react";
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
  forceTemplateMode?: boolean;
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
    eventType: "course",
    category: "programming",
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
  forceTemplateMode = false,
  formData,
  setFormData,
  onPreview,
  isSubmitting = false,
  submitButtonText
}) => {
  console.log("=== CourseForm INITIALIZATION DEBUG START ===");
  console.log("CourseForm: Props received:", {
    isTemplate,
    forceTemplateMode,
    initialDataIsTemplate: initialData.isTemplate,
    hasInitialDataId: !!initialData.id
  });

  // CRITICAL FIX: Determine initial template mode with immediate validation
  const determineInitialTemplateMode = () => {
    console.log("CourseForm: Determining initial template mode...");
    
    if (forceTemplateMode) {
      console.log("CourseForm: forceTemplateMode is TRUE - setting template mode to TRUE");
      return true;
    }
    
    if (isTemplate) {
      console.log("CourseForm: isTemplate prop is TRUE - setting template mode to TRUE");
      return true;
    }
    
    const fromInitialData = initialData.isTemplate || false;
    console.log("CourseForm: Using initialData.isTemplate:", fromInitialData);
    return fromInitialData;
  };

  const [isTemplateMode, setIsTemplateMode] = useState(determineInitialTemplateMode());
  
  console.log("CourseForm: Initial template mode determined as:", isTemplateMode);
  console.log("=== CourseForm INITIALIZATION DEBUG END ===");
  
  const form = useForm<CourseFormData>({
    defaultValues: {
      ...initialData,
      isTemplate: isTemplateMode // Ensure form starts with correct template flag
    } as CourseFormData
  });

  // CRITICAL FIX: Sync form state with forceTemplateMode immediately on mount and prop changes
  useEffect(() => {
    console.log("=== CourseForm useEffect SYNC DEBUG START ===");
    console.log("CourseForm: useEffect triggered - syncing template state");
    console.log("CourseForm: Current props:", { forceTemplateMode, isTemplate });
    console.log("CourseForm: Current isTemplateMode state:", isTemplateMode);
    
    let shouldBeTemplateMode = false;
    
    if (forceTemplateMode) {
      console.log("CourseForm: forceTemplateMode is TRUE - forcing template mode");
      shouldBeTemplateMode = true;
    } else if (isTemplate) {
      console.log("CourseForm: isTemplate prop is TRUE - setting template mode");
      shouldBeTemplateMode = true;
    } else {
      shouldBeTemplateMode = initialData.isTemplate || false;
      console.log("CourseForm: Using initialData.isTemplate:", shouldBeTemplateMode);
    }
    
    console.log("CourseForm: Calculated shouldBeTemplateMode:", shouldBeTemplateMode);
    
    if (shouldBeTemplateMode !== isTemplateMode) {
      console.log("CourseForm: Template mode mismatch - updating state from", isTemplateMode, "to", shouldBeTemplateMode);
      setIsTemplateMode(shouldBeTemplateMode);
    }
    
    // CRITICAL: Always sync the form's isTemplate value
    const currentFormValue = form.getValues("isTemplate");
    console.log("CourseForm: Current form isTemplate value:", currentFormValue);
    
    if (currentFormValue !== shouldBeTemplateMode) {
      console.log("CourseForm: Form isTemplate mismatch - updating from", currentFormValue, "to", shouldBeTemplateMode);
      form.setValue("isTemplate", shouldBeTemplateMode);
    }
    
    console.log("=== CourseForm useEffect SYNC DEBUG END ===");
  }, [forceTemplateMode, isTemplate, initialData.isTemplate, form, isTemplateMode]);

  // Update form mode when template switch changes (only if not forced)
  const handleTemplateToggle = (checked: boolean) => {
    if (forceTemplateMode) {
      console.log("CourseForm: Template toggle ignored due to forceTemplateMode");
      return;
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
    console.log("=== CourseForm handleSubmit VALIDATION DEBUG START ===");
    console.log("CourseForm: Form submission started");
    console.log("CourseForm: Raw form data received:", data);
    console.log("CourseForm: Props at submission:", { forceTemplateMode, isTemplate });
    console.log("CourseForm: Current isTemplateMode state:", isTemplateMode);
    console.log("CourseForm: data.isTemplate from form:", data.isTemplate);
    
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
    
    // CRITICAL FIX: Determine the correct template flag with strict validation
    let finalTemplateFlag = false;
    
    if (forceTemplateMode) {
      console.log("CourseForm: forceTemplateMode is TRUE - FORCING isTemplate to TRUE");
      finalTemplateFlag = true;
    } else if (isTemplate) {
      console.log("CourseForm: isTemplate prop is TRUE - setting isTemplate to TRUE");
      finalTemplateFlag = true;
    } else {
      // Use the current form/state value
      finalTemplateFlag = isTemplateMode;
      console.log("CourseForm: Using current template mode state:", finalTemplateFlag);
    }
    
    console.log("CourseForm: Final template flag determination:");
    console.log("  - forceTemplateMode:", forceTemplateMode);
    console.log("  - isTemplate prop:", isTemplate);
    console.log("  - isTemplateMode state:", isTemplateMode);
    console.log("  - data.isTemplate:", data.isTemplate);
    console.log("  - FINAL finalTemplateFlag:", finalTemplateFlag);
    
    // CRITICAL VALIDATION: Ensure templates are not lost
    if ((forceTemplateMode || isTemplate) && !finalTemplateFlag) {
      console.error("CRITICAL ERROR: Template flag validation failed!");
      console.error("Expected template=true but got:", finalTemplateFlag);
      throw new Error("Template flag validation failed in CourseForm - refusing to submit");
    }
    
    const finalData = {
      ...data,
      spotsAvailable: Number(data.spotsAvailable),
      isTemplate: finalTemplateFlag // Use the validated template flag
    };
    
    console.log("CourseForm: FINAL DATA being submitted:", finalData);
    console.log("CourseForm: FINAL isTemplate flag:", finalData.isTemplate);
    console.log("CourseForm: FINAL isTemplate type:", typeof finalData.isTemplate);
    
    // Final validation before submission
    if ((forceTemplateMode || isTemplate) && !finalData.isTemplate) {
      console.error("FINAL VALIDATION FAILED: Template expected but isTemplate is false");
      throw new Error("Final template validation failed - aborting submission");
    }
    
    console.log("=== CourseForm handleSubmit VALIDATION DEBUG END ===");
    
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
            <div className="mt-1 text-xs">
              Debug: forceTemplateMode={forceTemplateMode.toString()}, isTemplateMode={isTemplateMode.toString()}
            </div>
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
