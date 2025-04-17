
/**
 * Course utility functions for handling course-related operations
 */

import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/course";

/**
 * Check if a course has available spots by comparing registrations count with spots available
 * @param courseId The ID of the course to check
 * @param spotsAvailable The total spots available for the course
 * @returns An object containing availability status and spots left
 */
export const checkCourseAvailability = async (courseId: string, spotsAvailable: number) => {
  try {
    // Convert courseId to string to ensure consistency
    const id = String(courseId);
    
    // Get confirmed registrations count (pending + confirmed)
    const { data, error, count } = await supabase
      .from('course_registrations')
      .select('*', { count: 'exact' })
      .eq('course_id', id)
      .not('status', 'eq', 'cancelled');
    
    if (error) throw error;
    
    // Calculate spots left
    const registrationsCount = count || 0;
    const spotsLeft = spotsAvailable - registrationsCount;
    const isFull = spotsLeft <= 0;
    
    return {
      isFull,
      spotsLeft,
      registrationsCount,
      error: null
    };
  } catch (error) {
    console.error("Error checking course availability:", error);
    return {
      isFull: false,
      spotsLeft: spotsAvailable,
      registrationsCount: 0,
      error
    };
  }
};

/**
 * Format a registration status with proper capitalization
 * @param status The registration status to format
 * @returns Formatted status string
 */
export const formatRegistrationStatus = (status: string): string => {
  if (!status) return 'Pending';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};
