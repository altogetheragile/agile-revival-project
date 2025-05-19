
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseFormData } from "@/types/course";
import { toast } from "sonner";
import { getEventTypeByValue } from "@/services/event/eventTypeService";
import { createCourse as baseCreateCourse, updateCourse as baseUpdateCourse } from './mutations';

/**
 * Create a new course
 * @param courseData Course data to create
 * @returns The created course or null if creation failed
 */
export const createCourse = async (courseData: CourseFormData): Promise<Course | null> => {
  try {
    // Get the event type ID for the given event type value
    let eventTypeId = null;
    if (courseData.eventType) {
      const eventType = await getEventTypeByValue(courseData.eventType);
      if (eventType) {
        eventTypeId = eventType.id;
      }
    }

    // Add event_type_id to the course data
    const enrichedData = {
      ...courseData,
      event_type_id: eventTypeId
    };

    // Use the base create course function
    return await baseCreateCourse(enrichedData);
  } catch (error) {
    console.error("Error in createCourse:", error);
    toast.error("Failed to create course", {
      description: "An unexpected error occurred"
    });
    return null;
  }
};

/**
 * Update an existing course
 * @param id Course ID to update
 * @param courseData Updated course data
 * @param propagateChanges Whether to propagate changes to scheduled instances
 * @returns The updated course or null if update failed
 */
export const updateCourse = async (
  id: string,
  courseData: Partial<CourseFormData>,
  propagateChanges: boolean = false
): Promise<Course | null> => {
  try {
    // Get the event type ID for the given event type value
    let eventTypeId = undefined;
    if (courseData.eventType) {
      const eventType = await getEventTypeByValue(courseData.eventType);
      if (eventType) {
        eventTypeId = eventType.id;
      }
    }

    // Add event_type_id to the course data if eventType was provided
    const enrichedData = {
      ...courseData,
      ...(eventTypeId !== undefined ? { event_type_id: eventTypeId } : {})
    };

    // Use the base update course function
    return await baseUpdateCourse(id, enrichedData, propagateChanges);
  } catch (error) {
    console.error("Error in updateCourse:", error);
    toast.error("Failed to update course", {
      description: "An unexpected error occurred"
    });
    return null;
  }
};

// Re-export other functions to maintain the API
export { deleteCourse } from './mutations';
