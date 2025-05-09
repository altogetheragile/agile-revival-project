
import { useState } from "react";
import { Event, ScheduleEventFormData } from "@/types/event";
import { createEventFromTemplate } from "@/services/eventService";
import { toast } from "sonner";

export const useScheduleEvent = (onSuccess?: () => void) => {
  const [isScheduling, setIsScheduling] = useState(false);

  const scheduleEvent = async (templateId: string, scheduleData: ScheduleEventFormData) => {
    try {
      setIsScheduling(true);
      const scheduledEvent = await createEventFromTemplate(templateId, scheduleData);
      
      if (scheduledEvent) {
        toast.success("Event scheduled successfully", {
          description: `${scheduledEvent.title} has been scheduled.`
        });
        
        if (onSuccess) {
          onSuccess();
        }
        
        return scheduledEvent;
      }
      return null;
    } catch (error) {
      console.error("Error scheduling event:", error);
      toast.error("Failed to schedule event", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
      return null;
    } finally {
      setIsScheduling(false);
    }
  };

  return {
    scheduleEvent,
    isScheduling
  };
};
