
import { useState } from 'react';
import { toast } from 'sonner';
import { createCourseFromTemplate } from '@/services/courseService';
import { ScheduleCourseFormData } from '@/types/course';

export const useScheduleCourse = (onSuccess?: () => void) => {
  const [isScheduling, setIsScheduling] = useState(false);

  const scheduleCourse = async (templateId: string, data: ScheduleCourseFormData) => {
    try {
      setIsScheduling(true);
      console.log("Scheduling course from template:", templateId, data);
      
      const scheduledCourse = await createCourseFromTemplate(templateId, {
        templateId,
        dates: data.dates,
        location: data.location,
        instructor: data.instructor,
        spotsAvailable: Number(data.spotsAvailable),
        status: data.status || 'draft'
      });
      
      if (scheduledCourse) {
        toast.success("Course scheduled successfully", {
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
      toast.error("Failed to schedule course", {
        description: error?.message || "An unexpected error occurred"
      });
      return null;
    } finally {
      setIsScheduling(false);
    }
  };

  return { scheduleCourse, isScheduling };
};
