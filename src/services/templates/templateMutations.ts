
import { Course, ScheduleCourseFormData } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fallbackTemplates } from "./templateData";
import { mapDbToCourse } from "./templateMappers";

export const createCourseFromTemplate = async (templateId: string, scheduleData: ScheduleCourseFormData): Promise<Course | null> => {
  try {
    console.log(`Creating course from template ID: ${templateId}`, scheduleData);
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      toast.error("Authentication required", {
        description: "You must be logged in to perform this action."
      });
      return null;
    }
    
    // Verify admin role using RPC function
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      user_id: user.id,
      required_role: 'admin'
    });

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
    
    const { data: template, error: templateError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', templateId)
      .eq('is_template', true)
      .maybeSingle();
    
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
    
    const { data: createdCourse, error: createError } = await supabase
      .from('courses')
      .insert([newCourse])
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
  } catch (error: any) {
    console.error("Unexpected error creating course from template:", error);
    toast.error("Failed to schedule course", {
      description: "There was an unexpected error scheduling the course."
    });
    return null;
  }
};
