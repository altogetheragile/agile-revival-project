
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Course, ScheduleCourseFormData } from "@/types/course";
import MediaLibrary from "@/components/media/MediaLibrary";
import { ScheduleFormFields } from "./schedule-dialog/ScheduleFormFields";
import { ScheduleStatusField } from "./schedule-dialog/ScheduleStatusField";
import { ScheduleFormActions } from "./schedule-dialog/ScheduleFormActions";

interface ScheduleCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Course | null;
  onSubmit: (data: ScheduleCourseFormData) => void;
  onCancel: () => void;
  onOpenMediaLibrary?: () => void;
  isSubmitting?: boolean;
}

const ScheduleCourseDialog: React.FC<ScheduleCourseDialogProps> = ({
  open,
  onOpenChange,
  template,
  onSubmit,
  onCancel,
  onOpenMediaLibrary,
  isSubmitting = false
}) => {
  const form = useForm<ScheduleCourseFormData>({
    defaultValues: {
      templateId: template?.id || "",
      startDate: null,
      endDate: null,
      dates: "",
      location: "London",
      instructor: "Alun Davies-Baker",
      spotsAvailable: 12,
      status: "draft"
    }
  });

  const [isMediaLibOpen, setIsMediaLibOpen] = useState(false);

  const handleSubmit = (data: ScheduleCourseFormData) => {
    onSubmit({
      ...data,
      templateId: template?.id || "",
      spotsAvailable: Number(data.spotsAvailable)
    });
  };

  // Reset form when template changes
  useEffect(() => {
    if (template && open) {
      form.reset({
        templateId: template.id,
        startDate: null,
        endDate: null,
        dates: "",
        location: "London",
        instructor: "Alun Davies-Baker",
        spotsAvailable: 12,
        status: "draft"
      });
    }
  }, [template, form, open]);

  if (!template) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isSubmitting) {
          onOpenChange(isOpen);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Course: {template.title}</DialogTitle>
            <DialogDescription>
              Enter details to schedule this course.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <ScheduleFormFields form={form} />
              <ScheduleStatusField form={form} />
              <ScheduleFormActions 
                isSubmitting={isSubmitting} 
                onCancel={onCancel} 
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Include Media Library component if no external handler is provided */}
      {!onOpenMediaLibrary && (
        <MediaLibrary
          open={isMediaLibOpen}
          onOpenChange={setIsMediaLibOpen}
          onSelect={(url, aspectRatio, size, layout) => {
            // Handle media selection here if needed
            setIsMediaLibOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ScheduleCourseDialog;
