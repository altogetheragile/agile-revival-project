
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type EventType = {
  id: string;
  value: string;
  label: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateEventTypeData = {
  value: string;
  label: string;
};

export type UpdateEventTypeData = Partial<CreateEventTypeData>;

/**
 * Get all event types from the database
 * @returns An array of event types
 */
export const getEventTypes = async (): Promise<EventType[]> => {
  try {
    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .order('label');
    
    if (error) {
      console.error("Error fetching event types:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to fetch event types:", error);
    return [];
  }
};

/**
 * Get a specific event type by value
 * @param value The event type value to look up
 * @returns The event type or null if not found
 */
export const getEventTypeByValue = async (value: string): Promise<EventType | null> => {
  try {
    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .eq('value', value)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error("Error fetching event type:", error);
      }
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Failed to fetch event type with value ${value}:`, error);
    return null;
  }
};

/**
 * Get a specific event type by ID
 * @param id The event type ID to look up
 * @returns The event type or null if not found
 */
export const getEventTypeById = async (id: string): Promise<EventType | null> => {
  try {
    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error("Error fetching event type:", error);
      }
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Failed to fetch event type with id ${id}:`, error);
    return null;
  }
};

/**
 * Create a new event type
 * @param data The event type data to create
 * @returns The created event type or null if creation failed
 */
export const createEventType = async (data: CreateEventTypeData): Promise<EventType | null> => {
  try {
    // Validate input
    if (!data.value || !data.label) {
      toast.error("Missing required fields", {
        description: "Both value and label are required for event types"
      });
      return null;
    }
    
    const { data: eventType, error } = await supabase
      .from('event_types')
      .insert([{ 
        value: data.value.trim().toLowerCase(), 
        label: data.label.trim() 
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating event type:", error);
      
      // Handle duplicate value error
      if (error.code === '23505') { // Unique constraint violation
        toast.error("Event type already exists", {
          description: "An event type with this value already exists"
        });
      } else {
        toast.error("Error creating event type", {
          description: error.message
        });
      }
      
      return null;
    }
    
    return eventType;
  } catch (error) {
    console.error("Failed to create event type:", error);
    toast.error("Failed to create event type", {
      description: "An unexpected error occurred"
    });
    return null;
  }
};

/**
 * Update an existing event type
 * @param id The ID of the event type to update
 * @param data The data to update
 * @returns The updated event type or null if update failed
 */
export const updateEventType = async (id: string, data: UpdateEventTypeData): Promise<EventType | null> => {
  try {
    // Validate input
    if (Object.keys(data).length === 0) {
      return null;
    }
    
    const updateData: UpdateEventTypeData = {};
    
    if (data.value) {
      updateData.value = data.value.trim().toLowerCase();
    }
    
    if (data.label) {
      updateData.label = data.label.trim();
    }
    
    const { data: eventType, error } = await supabase
      .from('event_types')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating event type:", error);
      
      // Handle duplicate value error
      if (error.code === '23505') { // Unique constraint violation
        toast.error("Event type already exists", {
          description: "An event type with this value already exists"
        });
      } else {
        toast.error("Error updating event type", {
          description: error.message
        });
      }
      
      return null;
    }
    
    return eventType;
  } catch (error) {
    console.error(`Failed to update event type with id ${id}:`, error);
    toast.error("Failed to update event type", {
      description: "An unexpected error occurred"
    });
    return null;
  }
};

/**
 * Delete an event type
 * @param id The ID of the event type to delete
 * @returns true if deletion was successful, false otherwise
 */
export const deleteEventType = async (id: string): Promise<boolean> => {
  try {
    // Check if the event type is being used by any courses
    const { count, error: countError } = await supabase
      .from('courses')
      .select('id', { count: 'exact', head: true })
      .eq('event_type_id', id);
    
    if (countError) {
      console.error("Error checking event type usage:", countError);
      toast.error("Error checking event type usage", {
        description: countError.message
      });
      return false;
    }
    
    if (count && count > 0) {
      toast.error("Cannot delete event type", {
        description: `This event type is currently used by ${count} course(s)`
      });
      return false;
    }
    
    const { error } = await supabase
      .from('event_types')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting event type:", error);
      toast.error("Error deleting event type", {
        description: error.message
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to delete event type with id ${id}:`, error);
    toast.error("Failed to delete event type", {
      description: "An unexpected error occurred"
    });
    return false;
  }
};

/**
 * Get the count of courses using each event type
 * @returns A map of event type IDs to their usage counts
 */
export const getEventTypeUsageCounts = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('event_type_id')
      .not('event_type_id', 'is', null);
    
    if (error) {
      console.error("Error fetching event type usage:", error);
      return {};
    }
    
    // Count occurrences of each event_type_id
    const counts: Record<string, number> = {};
    data?.forEach(course => {
      if (course.event_type_id) {
        counts[course.event_type_id] = (counts[course.event_type_id] || 0) + 1;
      }
    });
    
    return counts;
  } catch (error) {
    console.error("Failed to fetch event type usage counts:", error);
    return {};
  }
};
