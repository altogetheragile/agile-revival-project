
import { Course, ScheduleCourseFormData } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Fallback template data to use when database access fails due to policy issues
const fallbackTemplates: Course[] = [
  {
    id: "template-001",
    title: "Professional Scrum Master",
    description: "Learn the essentials of being a Professional Scrum Master",
    category: "Agile",
    format: "in-person",
    duration: "2 days",
    skillLevel: "intermediate",
    status: "published",
    isTemplate: true,
    price: "£995",
    spotsAvailable: 12,
    // Adding the missing required properties
    dates: "TBD",
    location: "London",
    instructor: "Alun Davies-Baker"
  },
  {
    id: "template-002",
    title: "Agile Product Owner",
    description: "Master the role of Product Owner in an agile environment",
    category: "Agile",
    format: "in-person",
    duration: "2 days",
    skillLevel: "intermediate",
    status: "published",
    isTemplate: true,
    price: "£995",
    spotsAvailable: 12,
    // Adding the missing required properties
    dates: "TBD",
    location: "London",
    instructor: "Alun Davies-Baker"
  }
];

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
      
      // Check specifically for the RLS policy recursion error
      if (error.message && error.message.includes("infinite recursion detected in policy")) {
        console.log("Detected RLS policy recursion error, using fallback templates");
        toast.error("Database permission issue detected", {
          description: "Using local template data until the database issue is resolved."
        });
        return fallbackTemplates;
      }
      
      toast.error("Error loading templates", {
        description: error.message
      });
      return fallbackTemplates;
    }
    
    console.log(`Successfully fetched ${templates.length} course templates`);
    return templates.map(mapDbToCourse);
  } catch (err: any) {
    console.error("Unexpected error fetching course templates:", err);
    toast.error("Failed to load templates", {
      description: "There was an unexpected error loading templates. Using fallback data."
    });
    return fallbackTemplates;
  }
};

export const getCoursesByTemplateId = async (templateId: string): Promise<Course[]> => {
  try {
    console.log(`Fetching courses for template ID: ${templateId}`);
    
    // Check if this is one of our fallback template IDs
    if (templateId.startsWith('template-')) {
      console.log("Using fallback data for template courses");
      return []; // Return empty array for fallback templates
    }
    
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('template_id', templateId);
      
    if (error) {
      console.error("Error fetching courses by template id:", error);
      
      // Check specifically for the RLS policy recursion error
      if (error.message && error.message.includes("infinite recursion detected in policy")) {
        console.log("Detected RLS policy recursion error in getCoursesByTemplateId");
        toast.error("Database permission issue detected", {
          description: "Unable to fetch courses for this template due to a database permission issue."
        });
        return [];
      }
      
      toast.error("Error loading courses from template", {
        description: error.message
      });
      return [];
    }
    
    console.log(`Successfully fetched ${courses.length} courses from template ID: ${templateId}`);
    return courses.map(mapDbToCourse);
  } catch (err: any) {
    console.error("Unexpected error fetching courses by template id:", err);
    toast.error("Failed to load courses from template");
    return [];
  }
};

export const createCourseFromTemplate = async (templateId: string, scheduleData: ScheduleCourseFormData): Promise<Course | null> => {
  try {
    console.log(`Creating course from template ID: ${templateId}`, scheduleData);
    
    // Check if this is one of our fallback template IDs
    if (templateId.startsWith('template-')) {
      const fallbackTemplate = fallbackTemplates.find(t => t.id === templateId);
      if (!fallbackTemplate) {
        toast.error("Template not found", {
          description: "Could not find the specified template."
        });
        return null;
      }
      
      // Create a simulated "scheduled" course from the fallback template
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
    
    // Regular database flow for real templates
    const { data: template, error: templateError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', templateId)
      .eq('is_template', true)
      .maybeSingle();
    
    if (templateError) {
      // Check specifically for the RLS policy recursion error
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
