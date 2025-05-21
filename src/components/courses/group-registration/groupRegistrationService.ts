
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/course";
import { GroupRegistrationFormValues } from "./types";
import { checkCourseAvailability } from "@/utils/courseUtils";

/**
 * Submits group registration data to the backend
 */
export const submitGroupRegistration = async (
  values: GroupRegistrationFormValues, 
  course: Course
) => {
  // Ensure we're using string format for course_id
  const courseId = String(course.id);
  
  // Check participant count doesn't exceed available spots
  const participantCount = values.participants.length;
  
  // Check course availability again right before submitting
  const availability = await checkCourseAvailability(courseId, course.spotsAvailable);
  
  if (availability.spotsLeft < participantCount) {
    throw new Error(`Only ${availability.spotsLeft} spots available for this course.`);
  }
  
  // Create registrations for all participants
  const registrationsData = values.participants.map(participant => ({
    course_id: courseId,
    first_name: participant.firstName,
    last_name: participant.lastName,
    email: participant.email,
    // Make sure phone is never null - use empty string as fallback
    phone: participant.phone || "",
    company: values.organizationName,
    additional_notes: `Group registration by ${values.contactPerson.firstName} ${values.contactPerson.lastName} (${values.contactPerson.email}, ${values.contactPhone})${values.additionalNotes ? `. Notes: ${values.additionalNotes}` : ''}`,
    status: 'pending'
  }));
  
  const { error } = await supabase
    .from('course_registrations')
    .insert(registrationsData);

  if (error) {
    console.error("Supabase insert error:", error);
    
    // Handle RLS violations specifically
    if (error.message.includes('violates row-level security policy')) {
      throw new Error("Permission error: You can only register with your own email address or for users in your organization.");
    }
    
    throw error;
  }
  
  return {
    success: true,
    participantCount
  };
};
