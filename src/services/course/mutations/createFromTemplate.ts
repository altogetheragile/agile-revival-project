
import { supabase } from "@/integrations/supabase/client";
import { Course, ScheduleCourseFormData } from "@/types/course";
import { toast } from "sonner";
import { mapDbToCourse } from "../courseMappers";
import { handleMutationError } from "./baseCourseMutation";

// Create a course from template
export const createCourseFromTemplate = async (templateId: string, scheduleData: ScheduleCourseFormData): Promise<Course | null> => {
  try {
    console.log("Creating course from template ID:", templateId);
    console.log("Schedule data:", scheduleData);
    
    const { data: template, error: templateError } = await supabase
      .from('courses')
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
    
    console.log("Template found, creating new course:", template.title);
    
    // Extract id and other auto-generated fields
    const { 
      id,
      created_at, 
      updated_at,
      ...templateWithoutSystemFields 
    } = template;
    
    // Create new course based on template without including id
    const newCourseData = {
      ...templateWithoutSystemFields,
      dates: scheduleData.dates,
      location: scheduleData.location,
      instructor: scheduleData.instructor,
      spots_available: scheduleData.spotsAvailable,
      status: scheduleData.status || 'draft',
      is_template: false,
      template_id: templateId,
    };
    
    // Remove any database internal fields
    delete newCourseData.created_by;
    
    const { data: createdCourse, error: createError } = await supabase
      .from('courses')
      .insert([newCourseData])
      .select()
      .single();
      
    if (createError) {
      console.error("Error creating course from template:", createError);
      toast.error("Failed to create course", {
        description: createError.message
      });
      return null;
    }
    
    console.log("Course created successfully:", createdCourse.title);
    toast.success("Course scheduled successfully", {
      description: `${createdCourse.title} has been scheduled.`
    });
    return mapDbToCourse(createdCourse);
  } catch (error) {
    handleMutationError(error, "Failed to schedule course");
    return null;
  }
};
