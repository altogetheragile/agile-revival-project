
import { Event, EventFormData, ScheduleEventFormData } from "@/types/event";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mapDbToEvent, mapEventToDb } from "./eventMappers";
import { checkDatabaseHealth, getConnectionErrorDescription } from "@/utils/supabase/connection";
import { executeWithTimeout } from "@/utils/supabase/controllers";

// Create a new event
export const createEvent = async (eventData: EventFormData): Promise<Event | null> => {
  try {
    // First check database connectivity
    const connectionResult = await checkDatabaseHealth();
    if (!connectionResult.isConnected) {
      toast.error("Unable to save", {
        description: getConnectionErrorDescription(connectionResult.error)
      });
      return null;
    }
    
    const newEvent = mapEventToDb(eventData);
    
    console.log("Creating event with data:", newEvent);
    
    const { result, error } = await executeWithTimeout(
      async (signal) => {
        return await supabase
          .from('events')
          .insert([newEvent])
          .select()
          .abortSignal(signal)
          .single();
      },
      {
        timeoutMs: 10000,
        retries: 2,
        onTimeout: () => toast.error("Request timed out", {
          description: "The server took too long to respond. Please try again."
        })
      }
    );
      
    if (error || result?.error) {
      const actualError = error || result?.error;
      console.error("Error creating event:", actualError);
      
      if (actualError?.message?.includes('infinite recursion detected')) {
        toast.error("Permission configuration issue", {
          description: "The system is experiencing a temporary permission issue."
        });
      } else if (actualError?.message?.includes('violates row-level security policy')) {
        toast.error("Permission error", {
          description: "You don't have permission to create events. Try enabling Dev Mode."
        });
      } else {
        toast.error("Failed to create event", {
          description: actualError?.message || "Unknown error occurred"
        });
      }
      return null;
    }
    
    console.log("Event created successfully:", result?.data);
    toast.success("Event created successfully");
    return mapDbToEvent(result?.data);
  } catch (err) {
    console.error("Unexpected error in createEvent:", err);
    toast.error("Failed to create event", {
      description: err instanceof Error ? err.message : "Unknown error occurred"
    });
    return null;
  }
};

// Update an existing event
export const updateEvent = async (id: string, eventData: EventFormData): Promise<Event | null> => {
  try {
    // First check database connectivity
    const connectionResult = await checkDatabaseHealth();
    if (!connectionResult.isConnected) {
      toast.error("Unable to save", {
        description: getConnectionErrorDescription(connectionResult.error)
      });
      return null;
    }
    
    const updates = mapEventToDb(eventData);
    
    console.log("Updating event with ID:", id);
    console.log("Update data:", updates);
    
    const { result, error } = await executeWithTimeout(
      async (signal) => {
        return await supabase
          .from('events')
          .update(updates)
          .eq('id', id)
          .select()
          .abortSignal(signal)
          .single();
      },
      {
        timeoutMs: 10000,
        retries: 2,
        onTimeout: () => toast.error("Request timed out", {
          description: "The server took too long to respond. Please try again."
        })
      }
    );
      
    if (error || result?.error) {
      const actualError = error || result?.error;
      console.error("Error updating event:", actualError);
      
      if (actualError?.message?.includes('infinite recursion detected')) {
        toast.error("Permission configuration issue", {
          description: "The system is experiencing a temporary permission issue."
        });
      } else if (actualError?.message?.includes('violates row-level security policy')) {
        toast.error("Permission error", {
          description: "You don't have permission to update events. Try enabling Dev Mode."
        });
      } else {
        toast.error("Failed to update event", {
          description: actualError?.message || "Unknown error occurred"
        });
      }
      return null;
    }
    
    console.log("Event updated successfully:", result?.data);
    toast.success("Event updated successfully");
    return mapDbToEvent(result?.data);
  } catch (err) {
    console.error("Unexpected error in updateEvent:", err);
    toast.error("Failed to update event", {
      description: err instanceof Error ? err.message : "Unknown error occurred"
    });
    return null;
  }
};

// Delete an event
export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    // First check database connectivity
    const connectionResult = await checkDatabaseHealth();
    if (!connectionResult.isConnected) {
      toast.error("Unable to delete", {
        description: getConnectionErrorDescription(connectionResult.error)
      });
      return false;
    }
    
    console.log("Deleting event with ID:", id);
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting event:", error);
      
      if (error?.message?.includes('infinite recursion detected')) {
        toast.error("Permission configuration issue", {
          description: "The system is experiencing a temporary permission issue."
        });
      } else if (error?.message?.includes('violates row-level security policy')) {
        toast.error("Permission error", {
          description: "You don't have permission to delete events. Try enabling Dev Mode."
        });
      } else {
        toast.error("Failed to delete event", {
          description: error.message || "Unknown error occurred"
        });
      }
      return false;
    }
    
    console.log("Event deleted successfully");
    toast.success("Event deleted successfully");
    return true;
  } catch (err) {
    console.error("Unexpected error in deleteEvent:", err);
    toast.error("Failed to delete event", {
      description: err instanceof Error ? err.message : "Unknown error occurred"
    });
    return false;
  }
};

// Create an event from template
export const createEventFromTemplate = async (templateId: string, scheduleData: ScheduleEventFormData): Promise<Event | null> => {
  try {
    // First check database connectivity
    const connectionResult = await checkDatabaseHealth();
    if (!connectionResult.isConnected) {
      toast.error("Unable to schedule event", {
        description: getConnectionErrorDescription(connectionResult.error)
      });
      return null;
    }
    
    console.log("Creating event from template ID:", templateId);
    console.log("Schedule data:", scheduleData);
    
    const { result, error } = await executeWithTimeout(
      async (signal) => {
        return await supabase
          .from('events')
          .select('*')
          .eq('id', templateId)
          .eq('is_template', true)
          .abortSignal(signal)
          .maybeSingle();
      },
      {
        timeoutMs: 8000,
        retries: 1
      }
    );
    
    if (error || result?.error || !result?.data) {
      const actualError = error || result?.error;
      console.error("Error fetching template:", actualError);
      toast.error("Failed to fetch template", {
        description: actualError?.message || "Template not found"
      });
      return null;
    }
    
    const template = result.data;
    console.log("Template found, creating new event");
    
    // Create new event based on template
    const newEventData = {
      ...template,
      // Remove IDs and other fields that should be generated by the database
      id: undefined,
      created_at: undefined,
      updated_at: undefined,
      // Update with the new schedule data
      dates: scheduleData.dates,
      location: scheduleData.location,
      instructor: scheduleData.instructor,
      spots_available: scheduleData.spotsAvailable,
      status: scheduleData.status || 'draft',
      is_template: false,
      template_id: templateId,
    };
    
    const { result: createResult, error: createError } = await executeWithTimeout(
      async (signal) => {
        return await supabase
          .from('events')
          .insert([newEventData])
          .select()
          .abortSignal(signal)
          .single();
      },
      {
        timeoutMs: 10000,
        retries: 2
      }
    );
      
    if (createError || createResult?.error) {
      const actualError = createError || createResult?.error;
      console.error("Error creating event from template:", actualError);
      toast.error("Failed to create event", {
        description: actualError?.message || "Unknown error occurred"
      });
      return null;
    }
    
    console.log("Event created successfully:", createResult?.data);
    toast.success("Event scheduled successfully");
    return mapDbToEvent(createResult?.data);
  } catch (error) {
    console.error("Unexpected error creating event from template:", error);
    toast.error("Failed to schedule event", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return null;
  }
};
