
import { supabase } from "@/integrations/supabase/client";
import { Course, ScheduleCourseFormData } from "@/types/course";
import { toast } from "sonner";
import { mapDbToCourse } from "../courseMappers";
import { formatDateForDb, normalizeLearningOutcomes } from "@/utils/dateUtils";

/**
 * Create a new course instance from a template
 * @param templateId Template ID to use as a base
 * @param scheduleData Schedule-specific data to apply to the new instance
 * @returns The created course or null if creation failed
 */
export const createCourseFromTemplate = async (
  templateId: string,
  scheduleData: ScheduleCourseFormData
): Promise<Course | null> => {
  try {
    // First, get the template course
    const { data: templateData, error: templateError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', templateId)
      .eq('is_template', true)
      .single();

    if (templateError) {
      console.error("Error fetching template:", templateError);
      toast.error("Template not found", {
        description: "Could not find the template to create from"
      });
      return null;
    }

    // Create a new course based on the template
    const newCourseData = {
      ...templateData,
      title: templateData.title,
      description: templateData.description,
      dates: scheduleData.dates || "",
      start_date: formatDateForDb(scheduleData.startDate),
      end_date: formatDateForDb(scheduleData.endDate),
      location: scheduleData.location,
      instructor: scheduleData.instructor,
      price: templateData.price,
      spots_available: scheduleData.spotsAvailable,
      category: templateData.category,
      category_id: templateData.category_id,
      event_type: templateData.event_type,
      event_type_id: templateData.event_type_id,
      learning_outcomes: normalizeLearningOutcomes(templateData.learning_outcomes),
      prerequisites: templateData.prerequisites,
      target_audience: templateData.target_audience,
      duration: templateData.duration,
      skill_level: templateData.skill_level,
      skill_level_id: templateData.skill_level_id,
      format: templateData.format,
      status: scheduleData.status || 'draft',
      image_url: templateData.image_url,
      image_aspect_ratio: templateData.image_aspect_ratio,
      image_size: templateData.image_size,
      image_layout: templateData.image_layout,
      is_template: false,
      template_id: templateId
    };

    // Remove unnecessary fields from the new course data
    delete newCourseData.id;
    delete newCourseData.created_at;
    delete newCourseData.updated_at;

    // Insert the new course
    const { data: newCourse, error: insertError } = await supabase
      .from('courses')
      .insert([newCourseData])
      .select()
      .single();

    if (insertError) {
      console.error("Error creating course from template:", insertError);
      toast.error("Failed to create course", {
        description: insertError.message
      });
      return null;
    }

    toast.success("Course created from template", {
      description: `${newCourse.title} has been scheduled.`
    });
    
    return mapDbToCourse(newCourse);
  } catch (error: any) {
    console.error("Error in createCourseFromTemplate:", error);
    toast.error("Failed to create course", {
      description: error?.message || "An unexpected error occurred"
    });
    return null;
  }
};
