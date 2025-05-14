
import { useState } from "react";
import { Course } from "@/types/course";
import { useToast } from "@/components/ui/use-toast";
import { useScheduleCourse } from "@/hooks/useScheduleCourse";

export const useScheduleCourseDialog = (onSuccess: () => void) => {
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Course | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const { toast } = useToast();
  
  const { scheduleCourse } = useScheduleCourse(onSuccess);

  const handleScheduleCourse = (course: Course) => {
    setSelectedTemplate(course);
    setScheduleDialogOpen(true);
  };

  const handleScheduleSubmit = async (data: any) => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "No template selected for scheduling",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsScheduling(true);
      await scheduleCourse(selectedTemplate.id, data);
      
      toast({
        title: "Course scheduled",
        description: `${selectedTemplate.title} has been scheduled successfully.`,
      });
      setScheduleDialogOpen(false);
    } catch (error: any) {
      console.error("Error scheduling course:", error);
      toast({
        title: "Error",
        description: error?.message || "There was a problem scheduling the course.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return {
    scheduleDialogOpen,
    setScheduleDialogOpen,
    selectedTemplate,
    isScheduling,
    handleScheduleCourse,
    handleScheduleSubmit
  };
};
