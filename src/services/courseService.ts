
import { Course, CourseFormData, ScheduleCourseFormData } from "@/types/course";
import { mapDbToCourse, mapCourseToDb } from "@/services/course/courseMappers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get all courses
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    console.log("Fetching all courses...");
    
    // Add a timeout for debugging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Timeout fetching courses")), 15000);
    });
    
    const fetchPromise = supabase.from('courses').select('*');
    
    // Race between fetch and timeout
    const { data: courses, error } = await Promise.race([
      fetchPromise,
      timeoutPromise.then(() => { throw new Error("Timeout fetching courses"); })
    ]) as any;
    
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
    
    if (!courses || courses.length === 0) {
      console.log("No courses found in database");
      return [];
    }
    
    console.log(`Successfully fetched ${courses.length} courses`);
    return courses.map(mapDbToCourse);
  } catch (err) {
    console.error("Unexpected error fetching courses:", err);
    if (err instanceof Error) {
      toast.error("Failed to load courses", {
        description: err.message
      });
    } else {
      toast.error("Failed to load courses", {
        description: "There was an unexpected error loading courses."
      });
    }
    return [];
  }
};

// Get courses by category
export const getCoursesByCategory = async (category: string): Promise<Course[]> => {
  try {
    console.log("Fetching courses by category:", category);
    
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_template', false);
      
    if (error) {
      console.error("Error fetching courses by category:", error);
      toast.error("Failed to load courses");
      return [];
    }
    
    if (!courses || courses.length === 0) {
      console.log("No courses found for category:", category);
      return [];
    }
    
    console.log(`Fetched ${courses.length} courses for category filtering`);
    
    const mappedCourses = courses.map(mapDbToCourse);
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
    
    if (!courses || courses.length === 0) {
      console.log("No scheduled courses found");
      return [];
    }
    
    console.log(`Successfully fetched ${courses.length} scheduled courses`);
    return courses.map(mapDbToCourse);
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
    
    // Add a timeout for debugging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Timeout fetching course templates")), 15000);
    });
    
    const fetchPromise = supabase.from('courses').select('*').eq('is_template', true);
    
    // Race between fetch and timeout
    const { data: templates, error } = await Promise.race([
      fetchPromise,
      timeoutPromise.then(() => { throw new Error("Timeout fetching course templates"); })
    ]) as any;
    
    if (error) {
      console.error("Error fetching course templates:", error);
      toast.error("Failed to load course templates", {
        description: error.message
      });
      return [];
    }
    
    if (!templates) {
      console.log("No course templates found or null response");
      return [];
    }
    
    console.log(`Successfully fetched ${templates.length} course templates`);
    return templates.map(mapDbToCourse);
  } catch (err) {
    console.error("Unexpected error fetching course templates:", err);
    if (err instanceof Error) {
      toast.error("Failed to load course templates", {
        description: err.message
      });
    } else {
      toast.error("Failed to load course templates", {
        description: "There was an unexpected error loading the templates."
      });
    }
    return [];
  }
};

// Get a course by ID
export const getCourseById = async (id: string): Promise<Course | null> => {
  try {
    console.log("Fetching course by ID:", id);
    
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
      return null;
    }
    
    if (!course) {
      console.log("No course found with ID:", id);
      return null;
    }
    
    console.log("Successfully fetched course:", course);
    return mapDbToCourse(course);
  } catch (err) {
    console.error("Unexpected error fetching course:", err);
    toast.error("Failed to load course", {
      description: "There was an unexpected error loading the course."
    });
    return null;
  }
};

// Create a new course
export const createCourse = async (courseData: CourseFormData): Promise<Course | null> => {
  try {
    const newCourse = mapCourseToDb(courseData);
    
    console.log("Creating course with data:", newCourse);
    
    const { data, error } = await supabase
      .from('courses')
      .insert([newCourse])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course", {
        description: error.message
      });
      return null;
    }
    
    console.log("Course created successfully:", data);
    toast.success(newCourse.is_template ? "Template created successfully" : "Course created successfully");
    return mapDbToCourse(data);
  } catch (err) {
    console.error("Unexpected error in createCourse:", err);
    toast.error("Failed to create course", {
      description: err instanceof Error ? err.message : "Unknown error occurred"
    });
    return null;
  }
};

// Update an existing course
export const updateCourse = async (id: string, courseData: CourseFormData): Promise<Course | null> => {
  try {
    const updates = mapCourseToDb(courseData);
    
    console.log("Updating course with ID:", id);
    console.log("Update data:", updates);
    
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course", {
        description: error.message
      });
      return null;
    }
    
    console.log("Course updated successfully:", data);
    toast.success(updates.is_template ? "Template updated successfully" : "Course updated successfully");
    return mapDbToCourse(data);
  } catch (err) {
    console.error("Unexpected error in updateCourse:", err);
    toast.error("Failed to update course", {
      description: err instanceof Error ? err.message : "Unknown error occurred"
    });
    return null;
  }
};

// Delete a course
export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting course with ID:", id);
    
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course", {
        description: error.message
      });
      return false;
    }
    
    console.log("Course deleted successfully");
    toast.success("Course deleted successfully");
    return true;
  } catch (err) {
    console.error("Unexpected error in deleteCourse:", err);
    toast.error("Failed to delete course", {
      description: err instanceof Error ? err.message : "Unknown error occurred"
    });
    return false;
  }
};

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
    
    // Create new course based on template
    const newCourseData = {
      ...template,
      id: undefined, // Remove ID to get a new one
      created_at: undefined, // Let DB set this
      updated_at: undefined, // Let DB set this
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
    console.error("Unexpected error creating course from template:", error);
    toast.error("Failed to schedule course", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return null;
  }
};
