
import { useState } from 'react';
import { Course, CourseFormData, ScheduleCourseFormData } from '@/types/course';
import { createCourseFromTemplate } from '@/services/courseService';
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
      // Convert CourseFormData to ScheduleCourseFormData
      const scheduleData: ScheduleCourseFormData = {
        templateId: templateId,
        dates: data.dates || "",
        location: data.location || "",
        instructor: data.instructor || "",
        spotsAvailable: data.spotsAvailable || 0,
        status: data.status
      };
      
      const scheduledCourse = await createCourseFromTemplate(templateId, scheduleData);
      
      if (scheduledCourse) {
        toast("Course scheduled", {
          description: `${scheduledCourse.title} has been scheduled.`
        });
        
        if (onSuccess) {
          onSuccess();
        }
        
        return scheduledCourse;
      }
      return null;
    } catch (error: any) {
      console.error("Error scheduling course:", error);
      toast("Error", {
        description: error?.message || "There was a problem scheduling the course."
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
