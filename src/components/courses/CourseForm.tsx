
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

  // FIXED: Determine template mode with forceTemplateMode taking priority
  const isTemplateMode = forceTemplateMode || isTemplate || initialData.isTemplate || false;
  
  console.log("CourseForm: Final template mode determined as:", isTemplateMode);
  console.log("=== CourseForm INITIALIZATION DEBUG END ===");
  
  // FIXED: Update form defaultValues to respect forceTemplateMode
  const form = useForm<CourseFormData>({
    defaultValues: {
      ...initialData,
      isTemplate: forceTemplateMode ?? initialData.isTemplate ?? false
    } as CourseFormData
  });

  // FIXED: Simplified state management - use props directly instead of complex state
  const [internalTemplateMode, setInternalTemplateMode] = useState(isTemplateMode);

  // Sync internal state when props change (only for UI display, not form logic)
  useEffect(() => {
    const shouldBeTemplateMode = forceTemplateMode || isTemplate || initialData.isTemplate || false;
    setInternalTemplateMode(shouldBeTemplateMode);
    
    // Sync form value as well
    form.setValue("isTemplate", shouldBeTemplateMode);
    
    console.log("CourseForm: useEffect sync - setting template mode to:", shouldBeTemplateMode);
  }, [forceTemplateMode, isTemplate, initialData.isTemplate, form]);

  // Update form mode when template switch changes (only if not forced)
  const handleTemplateToggle = (checked: boolean) => {
    if (forceTemplateMode) {
      console.log("CourseForm: Template toggle ignored due to forceTemplateMode");
      return;
    }
    
    console.log("CourseForm: Template toggle changed to:", checked);
    setInternalTemplateMode(checked);
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
    console.log("=== CourseForm handleSubmit FIXED LOGIC DEBUG START ===");
    console.log("CourseForm: Form submission started");
    console.log("CourseForm: Raw form data received:", data);
    console.log("CourseForm: Props at submission:", { forceTemplateMode, isTemplate });
    
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
    
    // FIXED: Simplified template flag determination with forceTemplateMode priority - MOVED BEFORE USAGE
    const isTemplate = forceTemplateMode || form.getValues("isTemplate");
    
    console.log("CourseForm: FIXED - Template flag determination:");
    console.log("  - forceTemplateMode:", forceTemplateMode);
    console.log("  - form.getValues('isTemplate'):", form.getValues("isTemplate"));
    console.log("  - FINAL isTemplate:", isTemplate);
    
    // FIXED: Runtime assertion and debug statement
    console.log("CourseForm: Saving course with payload:", {
      is_template: isTemplate,
      fromForm: form.getValues("isTemplate"),
      forceTemplateMode,
      title: data.title
    });
    
    const finalData = {
      ...data,
      spotsAvailable: Number(data.spotsAvailable),
      isTemplate: isTemplate // Use the simplified template flag
    };
    
    console.log("CourseForm: FINAL DATA being submitted:", finalData);
    console.log("=== CourseForm handleSubmit FIXED LOGIC DEBUG END ===");
    
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
              checked={internalTemplateMode}
              onCheckedChange={handleTemplateToggle}
            />
            <Label htmlFor="template-mode" className="font-medium">
              {internalTemplateMode ? "Template Mode" : "Scheduled Event Mode"}
            </Label>
            <p className="ml-4 text-sm text-muted-foreground">
              {internalTemplateMode 
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
              Debug: forceTemplateMode={forceTemplateMode.toString()}, internalTemplateMode={internalTemplateMode.toString()}
            </div>
          </div>
        )}
        
        <BasicCourseFields form={form} />
        <CourseScheduleFields form={form} isTemplate={internalTemplateMode} />
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
          customSubmitText={submitButtonText || (internalTemplateMode ? "Save Template" : "Save Event")}
        />
      </form>
    </Form>
  );
};

export default CourseForm;
