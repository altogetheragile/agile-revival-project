
import { Event, EventFormData, ScheduleEventFormData } from "@/types/event";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mapDbToEvent, mapEventToDb } from "./event/eventMappers";

// Get all events
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    console.log("Fetching all events...");
    
    const { data: events, error } = await supabase
      .from('events')
      .select('*');
      
    if (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events", {
        description: error.message
      });
      return [];
    }
    
    if (!events || events.length === 0) {
      console.log("No events found in database");
      return [];
    }
    
    console.log(`Successfully fetched ${events.length} events`);
    return events.map(mapDbToEvent);
  } catch (err) {
    console.error("Unexpected error fetching events:", err);
    if (err instanceof Error) {
      toast.error("Failed to load events", {
        description: err.message
      });
    } else {
      toast.error("Failed to load events", {
        description: "There was an unexpected error loading events."
      });
    }
    return [];
  }
};

// Get a event by ID
export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    console.log("Fetching event by ID:", id);
    
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching event by id:", error);
      toast.error("Failed to load event", {
        description: error.message
      });
      return null;
    }
    
    if (!event) {
      console.log("No event found with ID:", id);
      return null;
    }
    
    console.log("Successfully fetched event:", event);
    return mapDbToEvent(event);
  } catch (err) {
    console.error("Unexpected error fetching event:", err);
    toast.error("Failed to load event", {
      description: "There was an unexpected error loading the event."
    });
    return null;
  }
};

// Create a new event
export const createEvent = async (eventData: EventFormData): Promise<Event | null> => {
  try {
    const newEvent = mapEventToDb(eventData);
    
    console.log("Creating event with data:", newEvent);
    
    const { data, error } = await supabase
      .from('events')
      .insert([newEvent])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event", {
        description: error.message
      });
      return null;
    }
    
    console.log("Event created successfully:", data);
    toast.success("Event created successfully");
    return mapDbToEvent(data);
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
    const updates = mapEventToDb(eventData);
    
    console.log("Updating event with ID:", id);
    console.log("Update data:", updates);
    
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event", {
        description: error.message
      });
      return null;
    }
    
    console.log("Event updated successfully:", data);
    toast.success("Event updated successfully");
    return mapDbToEvent(data);
  } catch (err) {
    console.error("Unexpected error in updateEvent:", err);
    toast.error("Failed to update event", {
      description: err instanceof Error ? err.message : "Unknown error occurred"
    });
    return null;
  }
};

// Delete a event
export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting event with ID:", id);
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event", {
        description: error.message
      });
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

// Create a event from template
export const createEventFromTemplate = async (templateId: string, scheduleData: ScheduleEventFormData): Promise<Event | null> => {
  try {
    console.log("Creating event from template ID:", templateId);
    console.log("Schedule data:", scheduleData);
    
    const { data: template, error: templateError } = await supabase
      .from('events')
      .select('*')
      .eq('id', templateId)
      .eq('is_template', true)
      .maybeSingle();
    
    if (templateError || !template) {
      console.error("Error fetching template:", templateError);
      toast.error("Failed to fetch template", {
        description: templateError?.message || "Template not found"
      });
      return null;
    }
    
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
    
    const { data: createdEvent, error: createError } = await supabase
      .from('events')
      .insert([newEventData])
      .select()
      .single();
      
    if (createError) {
      console.error("Error creating event from template:", createError);
      toast.error("Failed to create event", {
        description: createError.message
      });
      return null;
    }
    
    console.log("Event created successfully:", createdEvent);
    toast.success("Event scheduled successfully");
    return mapDbToEvent(createdEvent);
  } catch (error) {
    console.error("Unexpected error creating event from template:", error);
    toast.error("Failed to schedule event", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return null;
  }
};
