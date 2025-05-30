
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/course";
import { mapDbToCourse } from "./courseMappers";
import { EventType, getEventTypeById } from "@/services/event/eventTypeService";

export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*, event_types(*)')
      .is('deleted_at', null); // Only get non-deleted courses

    if (error) throw error;
    
    // Map database courses to Course objects, handling the new event_type_id relation
    return Promise.all(data.map(async (dbCourse) => {
      let eventType = dbCourse.event_type;
      
      // If we have an event_types relation, use that
      if (dbCourse.event_types) {
        eventType = dbCourse.event_types.value;
      }
      // If we still don't have an event type but have an event_type_id, fetch it
      else if (dbCourse.event_type_id && !eventType) {
        const eventTypeObj = await getEventTypeById(dbCourse.event_type_id);
        if (eventTypeObj) {
          eventType = eventTypeObj.value;
        }
      }
      
      return mapDbToCourse({
        ...dbCourse,
        eventType,
        deletedAt: dbCourse.deleted_at
      });
    }));
  } catch (error) {
    console.error("Error getting all courses:", error);
    throw error;
  }
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*, event_types(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw error;
    }

    if (!data) return null;

    // Determine the event type value
    let eventType = data.event_type;
    
    // If we have an event_types relation, use that
    if (data.event_types) {
      eventType = data.event_types.value;
    }
    // If we still don't have an event type but have an event_type_id, fetch it
    else if (data.event_type_id && !eventType) {
      const eventTypeObj = await getEventTypeById(data.event_type_id);
      if (eventTypeObj) {
        eventType = eventTypeObj.value;
      }
    }

    return mapDbToCourse({
      ...data,
      eventType,
      deletedAt: data.deleted_at
    });
  } catch (error) {
    console.error(`Error getting course with ID ${id}:`, error);
    throw error;
  }
};

export const getCoursesByCategory = async (category: string): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*, event_types(*)')
      .eq('category', category)
      .eq('is_template', false)
      .is('deleted_at', null) // Only get non-deleted courses
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map database courses to Course objects, handling the new event_type_id relation
    return Promise.all(data.map(async (dbCourse) => {
      let eventType = dbCourse.event_type;
      
      // If we have an event_types relation, use that
      if (dbCourse.event_types) {
        eventType = dbCourse.event_types.value;
      }
      // If we still don't have an event type but have an event_type_id, fetch it
      else if (dbCourse.event_type_id && !eventType) {
        const eventTypeObj = await getEventTypeById(dbCourse.event_type_id);
        if (eventTypeObj) {
          eventType = eventTypeObj.value;
        }
      }
      
      return mapDbToCourse({
        ...dbCourse,
        eventType,
        deletedAt: dbCourse.deleted_at
      });
    }));
  } catch (error) {
    console.error(`Error getting courses by category ${category}:`, error);
    throw error;
  }
};

/**
 * Get all published course templates
 */
export const getCourseTemplates = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*, event_types(*)')
      .eq('is_template', true)
      .is('deleted_at', null);  // Only get non-deleted templates

    if (error) throw error;
    
    // Map database courses to Course objects
    return Promise.all(data.map(async (dbCourse) => {
      let eventType = dbCourse.event_type;
      
      // If we have an event_types relation, use that
      if (dbCourse.event_types) {
        eventType = dbCourse.event_types.value;
      }
      // If we still don't have an event type but have an event_type_id, fetch it
      else if (dbCourse.event_type_id && !eventType) {
        const eventTypeObj = await getEventTypeById(dbCourse.event_type_id);
        if (eventTypeObj) {
          eventType = eventTypeObj.value;
        }
      }
      
      return mapDbToCourse({
        ...dbCourse,
        eventType,
        deletedAt: dbCourse.deleted_at
      });
    }));
  } catch (error) {
    console.error("Error getting course templates:", error);
    throw error;
  }
};

/**
 * Get scheduled courses (non-templates)
 * Optionally include deleted courses if showDeleted is true
 */
export const getScheduledCourses = async (showDeleted = false): Promise<Course[]> => {
  try {
    let query = supabase
      .from('courses')
      .select('*, event_types(*)')
      .eq('is_template', false);
    
    // Only filter by deleted_at if showDeleted is false
    if (!showDeleted) {
      query = query.is('deleted_at', null);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    
    // Map database courses to Course objects
    return Promise.all(data.map(async (dbCourse) => {
      let eventType = dbCourse.event_type;
      
      // If we have an event_types relation, use that
      if (dbCourse.event_types) {
        eventType = dbCourse.event_types.value;
      }
      // If we still don't have an event type but have an event_type_id, fetch it
      else if (dbCourse.event_type_id && !eventType) {
        const eventTypeObj = await getEventTypeById(dbCourse.event_type_id);
        if (eventTypeObj) {
          eventType = eventTypeObj.value;
        }
      }
      
      return mapDbToCourse({
        ...dbCourse,
        eventType,
        deletedAt: dbCourse.deleted_at
      });
    }));
  } catch (error) {
    console.error("Error getting scheduled courses:", error);
    throw error;
  }
};
