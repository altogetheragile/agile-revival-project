
import React, { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Course, ScheduleCourseFormData } from "@/types/course";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CourseScheduleFields } from "./form-utils/CourseScheduleFields";
import { DateRangeFields } from "@/components/form-utils/DateRangeFields";
import MediaLibrary from "@/components/media/MediaLibrary";
import { Loader2 } from "lucide-react";

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
  React.useEffect(() => {
    if (template && open) {
      form.reset({
        templateId: template.id,
        startDate: null,
        endDate: null,
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
              {/* Date Range Fields */}
              <DateRangeFields form={form} required={true} />
              
              {/* Location Field */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., London" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Instructor Field */}
              <FormField
                control={form.control}
                name="instructor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor</FormLabel>
                    <FormControl>
                      <Input placeholder="Instructor name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Spots Available Field */}
              <FormField
                control={form.control}
                name="spotsAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Spots</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Field */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="draft" id="draft" />
                          <Label htmlFor="draft">Draft</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="published" id="published" />
                          <Label htmlFor="published">Published</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Course"
                  )}
                </Button>
              </div>
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
