import { Course, ScheduleCourseFormData } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fallbackTemplates } from "./templateData";
import { mapDbToCourse } from "./templateMappers";
import { executeQuery } from "@/utils/supabase/query";
import { User } from "@supabase/supabase-js";
import { getCoursesByTemplateId } from "./templateQueries";
import { normalizeLearningOutcomes, formatDateForDb } from "@/utils/dateUtils";

export const createCourseFromTemplate = async (templateId: string, scheduleData: ScheduleCourseFormData): Promise<Course | null> => {
  try {
    console.log(`Creating course from template ID: ${templateId}`, scheduleData);
    
    // Check if user is authenticated using standard auth method
    const { data: authData, error: userError } = await supabase.auth.getUser();
    
    // Explicit null check
    if (userError || !authData?.user) {
      console.error("User not authenticated or error getting user:", userError);
      toast.error("Authentication required", {
        description: "You must be logged in to perform this action."
      });
      return null;
    }
    
    const user = authData.user;
    
    // Verify admin role using optimized check_user_role function directly to avoid recursion
    const { data: isAdmin, error: roleError } = await executeQuery<boolean>(
      async (signal) => await supabase.rpc('check_user_role', {
        user_id: user.id,
        required_role: 'admin'
      }),
      {
        timeoutMs: 20000,
        showErrorToast: true,
        errorMessage: "Permission check failed",
        retries: 2
      }
    );

    if (roleError) {
      console.error("Error checking admin role:", roleError);
      toast.error("Permission check failed", {
        description: "Unable to verify admin permissions."
      });
      return null;
    }

    if (!isAdmin) {
      console.error("User lacks admin role:", user.id);
      toast.error("Access denied", {
        description: "Admin privileges required to manage templates."
      });
      return null;
    }
    
    // Continue with existing template handling
    if (templateId.startsWith('template-')) {
      const fallbackTemplate = fallbackTemplates.find(t => t.id === templateId);
      if (!fallbackTemplate) {
        toast.error("Template not found", {
          description: "Could not find the specified template."
        });
        return null;
      }
      
      const scheduledCourse: Course = {
        ...fallbackTemplate,
        id: `scheduled-${Date.now()}`,
        isTemplate: false,
        templateId: templateId,
        dates: scheduleData.dates,
        location: scheduleData.location,
        instructor: scheduleData.instructor,
        spotsAvailable: scheduleData.spotsAvailable,
        status: scheduleData.status || 'draft'
      };
      
      toast.success("Course scheduled successfully (demo mode)", {
        description: `${scheduledCourse.title} has been scheduled.`
      });
      return scheduledCourse;
    }
    
    // Use executeQuery for better error handling with proper RLS error detection
    const { data: template, error: templateError } = await executeQuery<any>(
      async (signal) => await supabase
        .from('courses')
        .select('*')
        .eq('id', templateId)
        .eq('is_template', true)
        .maybeSingle(),
      {
        timeoutMs: 20000,
        showErrorToast: true,
        errorMessage: "Error fetching template",
        retries: 2
      }
    );
    
    if (templateError) {
      // Special handling for recursion errors which should now be fixed with our SQL changes
      if (templateError.message && templateError.message.includes("infinite recursion detected in policy")) {
        console.error("RLS policy recursion error when fetching template:", templateError);
        toast.error("Database permission issue", {
          description: "The database configuration has been updated. Please refresh the page and try again."
        });
        return null;
      }
      
      console.error("Error fetching template:", templateError);
      toast.error("Error fetching template", {
        description: templateError.message
      });
      return null;
    }
    
    if (!template) {
      console.error(`Template not found with ID: ${templateId}`);
      toast.error("Template not found", {
        description: `No template found with ID: ${templateId}`
      });
      return null;
    }
    
    console.log("Template found, creating new course:", template.title);
    
    // Fix: Extract id and other auto-generated fields to omit from the new course
    const { 
      id, 
      created_at, 
      updated_at,
      ...templateWithoutSystemFields 
    } = template;
    
    const newCourse = {
      ...templateWithoutSystemFields,
      dates: scheduleData.dates,
      location: scheduleData.location,
      instructor: scheduleData.instructor,
      spots_available: scheduleData.spotsAvailable,
      status: scheduleData.status || 'draft',
      is_template: false,
      template_id: templateId,
      created_by: user.id, // Use verified user ID
    };
    
    // Use executeQuery for better error handling with improved error detection
    const { data: createdCourse, error: createError } = await executeQuery<any>(
      async (signal) => await supabase
        .from('courses')
        .insert([newCourse])
        .select()
        .single(),
      {
        timeoutMs: 30000, // Increased timeout for course operations
        showErrorToast: true,
        errorMessage: "Failed to create course from template",
        retries: 2
      }
    );
      
    if (createError) {
      console.error("Error creating course from template:", createError);
      
      // Enhanced error messaging
      let errorMessage = "Failed to create course from template";
      if (createError.message?.includes('violates row-level security policy')) {
        errorMessage = "Permission issue: You don't have the required permissions";
      } else if (createError.message?.includes('timed out') || createError.message?.includes('connection')) {
        errorMessage = "Database connection issue: Please try again";
      }
      
      toast.error("Failed to create course", {
        description: errorMessage
      });
      
      return null;
    }
    
    console.log("Course created successfully:", createdCourse.title);
    toast.success("Course scheduled successfully", {
      description: `${createdCourse.title} has been scheduled.`
    });
    return mapDbToCourse(createdCourse);
  } catch (error: any) {
    console.error("Unexpected error creating course from template:", error);
    toast.error("Failed to schedule course", {
      description: "There was an unexpected error scheduling the course."
    });
    return null;
  }
};

/**
 * Updates all courses derived from a template with specified fields from the template
 * @param templateId The ID of the template that was updated
 * @param templateData Template data with fields that should be propagated
 * @returns Number of courses updated
 */
export const updateCoursesFromTemplate = async (templateId: string, templateData: Course): Promise<number> => {
  try {
    console.log(`Syncing changes from template ${templateId} to derived courses`);
    
    // Get all courses created from this template
    const derivedCourses = await getCoursesByTemplateId(templateId);
    
    if (!derivedCourses || derivedCourses.length === 0) {
      console.log(`No courses found derived from template ${templateId}`);
      return 0;
    }
    
    console.log(`Found ${derivedCourses.length} courses derived from template ${templateId}`);
    
    // Process learning outcomes to ensure proper format for database
    const processedLearningOutcomes = normalizeLearningOutcomes(templateData.learningOutcomes);
    
    // These are the fields we want to sync from the template to the courses
    // Only sync fields that shouldn't be independently customized
    const fieldsToSync = {
      title: templateData.title,
      description: templateData.description,
      category: templateData.category,
      price: templateData.price,
      learning_outcomes: processedLearningOutcomes,
      prerequisites: templateData.prerequisites,
      target_audience: templateData.targetAudience,
      duration: templateData.duration,
      skill_level: templateData.skillLevel,
      format: templateData.format,
      event_type: templateData.eventType,
      image_url: templateData.imageUrl,
      image_aspect_ratio: templateData.imageAspectRatio,
      image_layout: templateData.imageLayout,
      image_size: templateData.imageSize
    };
    
    // Log the fields being synchronized
    console.log("Syncing the following fields from template to courses:", Object.keys(fieldsToSync));
    
    // Count successful updates
    let updatedCount = 0;
    
    // Update each course one by one to provide better error control
    for (const course of derivedCourses) {
      const { error } = await supabase
        .from('courses')
        .update(fieldsToSync)
        .eq('id', course.id)
        .eq('template_id', templateId);
        
      if (error) {
        console.error(`Error updating course ${course.id} from template:`, error);
      } else {
        updatedCount++;
      }
    }
    
    console.log(`Successfully updated ${updatedCount} of ${derivedCourses.length} courses`);
    return updatedCount;
  } catch (err) {
    console.error("Error in updateCoursesFromTemplate:", err);
    toast.error("Failed to sync template changes", {
      description: "There was an error updating courses from the template."
    });
    return 0;
  }
};
