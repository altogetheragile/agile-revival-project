
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseFormData } from "@/types/course";
import { toast } from "sonner";
import { mapDbToCourse, mapCourseToDb } from "./courseMappers";

// Create a new course
export const createCourse = async (courseData: CourseFormData): Promise<Course | null> => {
  try {
    const newCourse = mapCourseToDb(courseData);
    
    console.log("Creating course with data:", newCourse);
    console.log("Is template:", newCourse.is_template);
    console.log("Auth status:", { 
      session: await supabase.auth.getSession(),
      isLoggedIn: !!(await supabase.auth.getUser()).data.user
    });
    
    // Ensure required fields for templates
    if (newCourse.is_template) {
      // Ensure template required fields have defaults
      newCourse.dates = newCourse.dates || "Template - No Dates";
      newCourse.location = newCourse.location || "To Be Determined";
      newCourse.instructor = newCourse.instructor || "To Be Assigned";
      newCourse.spots_available = newCourse.spots_available || 0;
    }

    // Log the complete object being sent to the database
    console.log("Full course object being sent to database:", JSON.stringify(newCourse, null, 2));
    
    const { data, error } = await supabase
      .from('courses')
      .insert(newCourse)
      .select()
      .single();
      
    if (error) {
      console.error("Error creating course:", error);
      
      // Check for specific error types
      if (error.code === '42501') {
        toast.error("Permission denied", {
          description: "You don't have sufficient permissions to create courses"
        });
      } else if (error.code === '23505') {
        toast.error("Duplicate entry", {
          description: "A course with these details already exists"
        });
      } else {
        toast.error("Failed to create course", {
          description: error.message
        });
      }
      return null;
    }
    
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
    console.log("Is template:", updates.is_template);
    console.log("Auth status:", { 
      session: await supabase.auth.getSession(),
      isLoggedIn: !!(await supabase.auth.getUser()).data.user
    });

    // Ensure required fields for templates
    if (updates.is_template) {
      // Ensure template required fields have defaults
      updates.dates = updates.dates || "Template - No Dates";
      updates.location = updates.location || "To Be Determined";
      updates.instructor = updates.instructor || "To Be Assigned";
      updates.spots_available = updates.spots_available || 0;
    }

    // Log the complete object being sent to the database
    console.log("Full update object being sent to database:", JSON.stringify(updates, null, 2));

    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating course:", error);
      
      // Check for specific error types
      if (error.code === '42501') {
        toast.error("Permission denied", {
          description: "You don't have sufficient permissions to update courses"
        });
      } else {
        toast.error("Failed to update course", {
          description: error.message
        });
      }
      return null;
    }
    
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
    console.log("Auth status:", { 
      session: await supabase.auth.getSession(),
      isLoggedIn: !!(await supabase.auth.getUser()).data.user
    });
    
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting course:", error);
      
      // Check for specific error types
      if (error.code === '42501') {
        toast.error("Permission denied", {
          description: "You don't have sufficient permissions to delete courses"
        });
      } else {
        toast.error("Failed to delete course", {
          description: error.message
        });
      }
      return false;
    }
    
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
