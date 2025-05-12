
import { Course, ScheduleCourseFormData } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fallbackTemplates } from "./templateData";
import { mapDbToCourse } from "./templateMappers";
import { executeQuery } from "@/utils/supabase/query";
import { User } from "@supabase/supabase-js";

export const createCourseFromTemplate = async (templateId: string, scheduleData: ScheduleCourseFormData): Promise<Course | null> => {
  try {
    console.log(`Creating course from template ID: ${templateId}`, scheduleData);
    
    // Check if user is authenticated using executeQuery for better error handling
    const { data: authData, error: userError } = await executeQuery<{ user: User }>(
      async (signal) => await supabase.auth.getUser(),
      {
        timeoutMs: 20000,
        showErrorToast: true,
        errorMessage: "Authentication check failed",
        retries: 2
      }
    );
    
    // Type assertion after checking the data exists
    if (userError || !authData || !authData.user) {
      console.error("User not authenticated or error getting user:", userError);
      toast.error("Authentication required", {
        description: "You must be logged in to perform this action."
      });
      return null;
    }
    
    const user = authData.user;
    
    // Verify admin role using optimized RPC function call
    const { data: isAdmin, error: roleError } = await executeQuery<boolean>(
      (signal) => supabase.rpc('has_role', {
        user_id: user.id,
        required_role: 'admin'
      }).abortSignal(signal),
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
    
    // Use executeQuery for better error handling
    const { data: template, error: templateError } = await executeQuery<any>(
      (signal) => supabase
        .from('courses')
        .select('*')
        .eq('id', templateId)
        .eq('is_template', true)
        .abortSignal(signal)
        .maybeSingle(),
      {
        timeoutMs: 20000,
        showErrorToast: true,
        errorMessage: "Error fetching template",
        retries: 2
      }
    );
    
    if (templateError) {
      if (templateError.message && templateError.message.includes("infinite recursion detected in policy")) {
        console.error("RLS policy recursion error when fetching template:", templateError);
        toast.error("Database permission issue", {
          description: "Unable to access database due to a permission configuration issue."
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
    
    const newCourse = {
      ...template,
      id: undefined,
      dates: scheduleData.dates,
      location: scheduleData.location,
      instructor: scheduleData.instructor,
      spots_available: scheduleData.spotsAvailable,
      status: scheduleData.status || 'draft',
      is_template: false,
      template_id: templateId,
      created_by: user.id, // Use verified user ID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Use executeQuery for better error handling
    const { data: createdCourse, error: createError } = await executeQuery<any>(
      (signal) => supabase
        .from('courses')
        .insert([newCourse])
        .select()
        .abortSignal(signal)
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
