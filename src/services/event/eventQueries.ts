
import { Event } from "@/types/event";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mapDbToEvent } from "./eventMappers";

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
