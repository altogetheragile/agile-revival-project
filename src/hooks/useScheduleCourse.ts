
import { useState } from 'react';
import { Course, CourseFormData } from '@/types/course';
import { createCourseFromTemplate } from '@/services/courseTemplateService'; 
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

export const useScheduleCourse = (onSuccess?: () => void) => {
  const [isScheduling, setIsScheduling] = useState(false);
  const { toast: uiToast } = useToast();
  
  const scheduleCourse = async (templateId: string, data: CourseFormData) => {
    if (!templateId) {
      uiToast({
        title: "Error",
        description: "No template selected for scheduling",
        variant: "destructive"
      });
      return null;
    }

    try {
      setIsScheduling(true);
      const scheduledCourse = await createCourseFromTemplate(templateId, data);
      
      if (scheduledCourse) {
        toast({
          title: "Course scheduled",
          description: `${scheduledCourse.title} has been scheduled.`,
        });
        
        if (onSuccess) {
          onSuccess();
        }
        
        return scheduledCourse;
      }
      return null;
    } catch (error: any) {
      console.error("Error scheduling course:", error);
      toast({
        title: "Error",
        description: error?.message || "There was a problem scheduling the course.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsScheduling(false);
    }
  };

  return {
    scheduleCourse,
    isScheduling
  };
};
