
import { Course } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const mapDbToCourse = (dbCourse: any): Course => ({
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
  eventType: dbCourse.event_type || "course", // Add default event type
});

// Fallback template data
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
    dates: "TBD",
    location: "London",
    instructor: "Alun Davies-Baker",
    eventType: "course" // Add event type
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
    dates: "TBD",
    location: "London",
    instructor: "Alun Davies-Baker",
    eventType: "workshop" // Add event type
  }
];

export const getCourseTemplates = async (): Promise<Course[]> => {
  try {
    console.log("Fetching course templates...");
    const { data: templates, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_template', true);
      
    if (error) {
      console.error("Error fetching course templates:", error);
      
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
    
    if (templateId.startsWith('template-')) {
      console.log("Using fallback data for template courses");
      return [];
    }
    
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('template_id', templateId);
      
    if (error) {
      console.error("Error fetching courses by template id:", error);
      
      if (error.message?.includes("infinite recursion detected in policy")) {
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
