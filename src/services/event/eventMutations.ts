
import { Event, EventFormData, ScheduleEventFormData } from "@/types/event";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mapDbToEvent, mapEventToDb } from "./eventMappers";
import { checkDatabaseHealth } from "@/utils/supabase/connection";
import { executeWithTimeout } from "@/utils/supabase/controllers";

// Create a new event
export const createEvent = async (eventData: EventFormData): Promise<Event | null> => {
  try {
    // First check database connectivity
    const connectionResult = await checkDatabaseHealth();
    if (!connectionResult.isConnected) {
      toast.error("Unable to save", {
        description: "Database connection issue. Please try again later."
      });
      return null;
    }
    
    const newEvent = mapEventToDb(eventData);
    
    console.log("Creating event with data:", newEvent);
    
    toast.error("Operation failed", {
      description: "Events functionality is currently not available. Database schema update is required."
    });
    
    return null;

    // This code will be enabled once the events table is created
    /*
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
          description: "You don't have permission to create events. Please contact an administrator."
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
    */
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
        description: "Database connection issue. Please try again later."
      });
      return null;
    }
    
    const updates = mapEventToDb(eventData);
    
    console.log("Updating event with ID:", id);
    console.log("Update data:", updates);
    
    toast.error("Operation failed", {
      description: "Events functionality is currently not available. Database schema update is required."
    });
    
    return null;

    // This code will be enabled once the events table is created
    /*
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
    */
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
        description: "Database connection issue. Please try again later."
      });
      return false;
    }
    
    console.log("Deleting event with ID:", id);
    
    toast.error("Operation failed", {
      description: "Events functionality is currently not available. Database schema update is required."
    });
    
    return false;

    // This code will be enabled once the events table is created
    /*
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
    */
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
        description: "Database connection issue. Please try again later."
      });
      return null;
    }
    
    console.log("Creating event from template ID:", templateId);
    console.log("Schedule data:", scheduleData);
    
    toast.error("Operation failed", {
      description: "Events functionality is currently not available. Database schema update is required."
    });
    
    return null;

    // This code will be enabled once the events table is created
    /*
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', templateId)
      .eq('is_template', true)
      .single();
    
    if (error || !data) {
      console.error("Error fetching template:", error);
      toast.error("Failed to fetch template", {
        description: error?.message || "Template not found"
      });
      return null;
    }
    
    const template = data;
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
    
    const { data: newEvent, error: createError } = await supabase
      .from('events')
      .insert([newEventData])
      .select()
      .single();
      
    if (createError) {
      console.error("Error creating event from template:", createError);
      
      if (createError?.message?.includes('violates row-level security policy')) {
        toast.error("Permission error", {
          description: "You don't have permission to create events. Please contact an administrator."
        });
      } else {
        toast.error("Failed to create event", {
          description: createError.message || "Unknown error occurred"
        });
      }
      return null;
    }
    
    console.log("Event created successfully:", newEvent);
    toast.success("Event scheduled successfully");
    return mapDbToEvent(newEvent);
    */
  } catch (error) {
    console.error("Unexpected error creating event from template:", error);
    toast.error("Failed to schedule event", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return null;
  }
};
