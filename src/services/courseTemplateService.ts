
import { Course, ScheduleCourseFormData } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Map from database fields to Course type
const mapDbToCourse = (dbCourse: any): Course => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description,
    dates: dbCourse.dates,
    location: dbCourse.location,
    instructor: dbCourse.instructor,
    price: dbCourse.price,
    category: dbCourse.category,
    spotsAvailable: dbCourse.spots_available,
    learningOutcomes: dbCourse.learning_outcomes,
    prerequisites: dbCourse.prerequisites,
    targetAudience: dbCourse.target_audience,
    duration: dbCourse.duration,
    skillLevel: dbCourse.skill_level,
    format: dbCourse.format,
    status: dbCourse.status,
    materials: dbCourse.materials || [],
    googleDriveFolderId: dbCourse.google_drive_folder_id,
    googleDriveFolderUrl: dbCourse.google_drive_folder_url,
    isTemplate: dbCourse.is_template,
    templateId: dbCourse.template_id,
    imageUrl: dbCourse.image_url,
    imageAspectRatio: dbCourse.image_aspect_ratio,
    imageSize: dbCourse.image_size,
    imageLayout: dbCourse.image_layout,
  };
};

export const getCourseTemplates = async (): Promise<Course[]> => {
  try {
    console.log("Fetching course templates...");
    const { data: templates, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_template', true);
      
    if (error) {
      console.error("Error fetching course templates:", error);
      
      // More descriptive error message for RLS issues
      if (error.message && error.message.includes("infinite recursion")) {
        toast.error("Database permission error", {
          description: "There's a problem with the database permissions. Please contact an administrator."
        });
      } else {
        toast.error("Error loading templates", {
          description: error.message
        });
      }
      return [];
    }
    
    console.log(`Successfully fetched ${templates.length} course templates`);
    return templates.map(mapDbToCourse);
  } catch (err: any) {
    console.error("Unexpected error fetching course templates:", err);
    
    // Check for RLS permission error in the caught exception
    const errorMessage = err?.message || "There was an unexpected error";
    if (errorMessage.includes("infinite recursion")) {
      toast.error("Database permission error", {
        description: "There's a problem with user permissions in the database. Please contact an administrator."
      });
    } else {
      toast.error("Failed to load templates", {
        description: "There was an unexpected error loading templates."
      });
    }
    return [];
  }
};

export const getCoursesByTemplateId = async (templateId: string): Promise<Course[]> => {
  try {
    console.log(`Fetching courses for template ID: ${templateId}`);
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('template_id', templateId);
      
    if (error) {
      console.error("Error fetching courses by template id:", error);
      
      // Check for RLS errors
      if (error.message && error.message.includes("infinite recursion")) {
        toast.error("Database permission error", {
          description: "There's a problem with user permissions. Please contact an administrator."
        });
      } else {
        toast.error("Error loading courses from template", {
          description: error.message
        });
      }
      return [];
    }
    
    console.log(`Successfully fetched ${courses.length} courses from template ID: ${templateId}`);
    return courses.map(mapDbToCourse);
  } catch (err: any) {
    console.error("Unexpected error fetching courses by template id:", err);
    
    // Check for RLS errors
    const errorMessage = err?.message || "There was an unexpected error";
    if (errorMessage.includes("infinite recursion")) {
      toast.error("Database permission error", {
        description: "There's a problem with database permissions. Please contact an administrator."
      });
    } else {
      toast.error("Failed to load courses from template");
    }
    return [];
  }
};

export const createCourseFromTemplate = async (templateId: string, scheduleData: ScheduleCourseFormData): Promise<Course | null> => {
  try {
    console.log(`Creating course from template ID: ${templateId}`, scheduleData);
    // First fetch the template
    const { data: template, error: templateError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', templateId)
      .eq('is_template', true)
      .maybeSingle();
    
    if (templateError) {
      console.error("Error fetching template:", templateError);
      
      // Check for RLS errors
      if (templateError.message && templateError.message.includes("infinite recursion")) {
        toast.error("Database permission error", {
          description: "There's a problem with user permissions. Please contact an administrator."
        });
      } else {
        toast.error("Error fetching template", {
          description: templateError.message
        });
      }
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
    
    // Create a new course based on the template
    const newCourse = {
      ...template,
      id: undefined, // Let the database generate a new ID
      dates: scheduleData.dates,
      location: scheduleData.location,
      instructor: scheduleData.instructor,
      spots_available: scheduleData.spotsAvailable,
      status: scheduleData.status || 'draft',
      is_template: false,
      template_id: templateId,
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
      
      // Check for RLS errors
      if (createError.message && createError.message.includes("infinite recursion")) {
        toast.error("Database permission error", {
          description: "There's a problem with user permissions when creating courses. Please contact an administrator."
        });
      } else {
        toast.error("Failed to create course", {
          description: createError.message
        });
      }
      return null;
    }
    
    console.log("Course created successfully:", createdCourse.title);
    toast.success("Course scheduled successfully", {
      description: `${createdCourse.title} has been scheduled.`
    });
    return mapDbToCourse(createdCourse);
  } catch (error: any) {
    console.error("Unexpected error creating course from template:", error);
    
    // Check for RLS errors
    const errorMessage = error?.message || "There was an unexpected error";
    if (errorMessage.includes("infinite recursion")) {
      toast.error("Database permission issue", {
        description: "There's a problem with user role permissions in the database. Please contact an administrator."
      });
    } else {
      toast.error("Failed to schedule course", {
        description: "There was an unexpected error scheduling the course."
      });
    }
    return null;
  }
};
