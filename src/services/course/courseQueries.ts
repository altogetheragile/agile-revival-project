
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/course";
import { toast } from "sonner";
import { mapDbToCourse } from "./courseMappers";

// Get all courses
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    console.log("Fetching all courses...");
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*');
      
    if (error) {
      console.error("Error fetching courses:", error);
      
      if (error.message?.includes('infinite recursion detected')) {
        console.error("RLS policy recursion error detected");
        toast.error("Database permission issue", {
          description: "Unable to access courses due to a permission configuration issue."
        });
        return [];
      }
      
      toast.error("Failed to load courses", {
        description: error.message
      });
      return [];
    }
    
    console.log(`Successfully fetched ${courses.length} courses`);
    return courses.map((dbCourse) => mapDbToCourse(dbCourse));
  } catch (err) {
    console.error("Unexpected error fetching courses:", err);
    toast.error("Failed to load courses", {
      description: "There was an unexpected error loading courses."
    });
    return [];
  }
};

// Get courses by category
export const getCoursesByCategory = async (category: string): Promise<Course[]> => {
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_template', false);
      
    if (error) {
      console.error("Error fetching courses by category:", error);
      toast.error("Failed to load courses");
      return [];
    }
    
    const mappedCourses = courses.map((dbCourse) => mapDbToCourse(dbCourse));
    return category === 'all' ? mappedCourses : mappedCourses.filter(course => course.category === category);
  } catch (err) {
    console.error("Unexpected error fetching courses by category:", err);
    toast.error("Failed to load courses");
    return [];
  }
};

// Get scheduled (non-template) courses
export const getScheduledCourses = async (): Promise<Course[]> => {
  try {
    console.log("Fetching scheduled courses...");
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_template', false);
      
    if (error) {
      console.error("Error fetching scheduled courses:", error);
      toast.error("Failed to load scheduled courses", {
        description: error.message
      });
      return [];
    }
    
    console.log(`Successfully fetched ${courses.length} scheduled courses`);
    return courses.map((dbCourse) => mapDbToCourse(dbCourse));
  } catch (err) {
    console.error("Unexpected error fetching scheduled courses:", err);
    toast.error("Failed to load scheduled courses", {
      description: "There was an unexpected error loading the courses."
    });
    return [];
  }
};

// Get course templates
export const getCourseTemplates = async (): Promise<Course[]> => {
  try {
    console.log("Fetching course templates...");
    const { data: templates, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_template', true);
      
    if (error) {
      console.error("Error fetching course templates:", error);
      toast.error("Failed to load course templates", {
        description: error.message
      });
      return [];
    }
    
    console.log(`Successfully fetched ${templates.length} course templates`);
    return templates.map((dbCourse) => mapDbToCourse(dbCourse));
  } catch (err) {
    console.error("Unexpected error fetching course templates:", err);
    toast.error("Failed to load course templates", {
      description: "There was an unexpected error loading the templates."
    });
    return [];
  }
};

// Get a course by ID
export const getCourseById = async (id: string): Promise<Course | undefined> => {
  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching course by id:", error);
      toast.error("Failed to load course", {
        description: error.message
      });
      return undefined;
    }
    
    return course ? mapDbToCourse(course) : undefined;
  } catch (err) {
    console.error("Unexpected error fetching course:", err);
    toast.error("Failed to load course", {
      description: "There was an unexpected error loading the course."
    });
    return undefined;
  }
};
