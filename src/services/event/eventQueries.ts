
import { Event } from "@/types/event";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mapDbToEvent } from "./eventMappers";
import { executeQuery } from "@/utils/supabase/query";

// Get all events
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    console.log("Fetching all events...");
    
    const { data, error } = await executeQuery<any[]>(
      async (signal) => await supabase
        .from('events')
        .select('*'),
      {
        timeoutMs: 10000,
        retries: 2,
        errorMessage: "Failed to load events"
      }
    );
      
    if (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events", {
        description: error.message
      });
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log("No events found in database");
      return [];
    }
    
    console.log(`Successfully fetched ${data.length} events`);
    return data.map(mapDbToEvent);
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
    
    const { data, error } = await executeQuery<any>(
      async (signal) => await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .maybeSingle(),
      {
        timeoutMs: 8000,
        retries: 1,
        errorMessage: `Failed to load event with ID ${id}`
      }
    );
      
    if (error) {
      console.error("Error fetching event by id:", error);
      toast.error("Failed to load event", {
        description: error.message
      });
      return null;
    }
    
    if (!data) {
      console.log("No event found with ID:", id);
      return null;
    }
    
    console.log("Successfully fetched event:", data);
    return mapDbToEvent(data);
  } catch (err) {
    console.error("Unexpected error fetching event:", err);
    toast.error("Failed to load event", {
      description: "There was an unexpected error loading the event."
    });
    return null;
  }
};
