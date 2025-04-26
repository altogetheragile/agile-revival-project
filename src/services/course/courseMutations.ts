import { supabase } from "@/integrations/supabase/client";
import { Course, CourseFormData } from "@/types/course";
import { toast } from "sonner";
import { mapDbToCourse, mapCourseToDb } from "./courseMappers";

export const createCourse = async (courseData: CourseFormData): Promise<Course | null> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      toast.error("Authentication required", {
        description: "You must be logged in to perform this action."
      });
      return null;
    }

    // If this is a template, verify admin role
    if (courseData.isTemplate) {
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
          description: "Admin privileges required to create templates."
        });
        return null;
      }
    }

    const newCourse = {
      ...mapCourseToDb(courseData),
      created_by: user.id
    };
    
    console.log("Creating course with data:", newCourse);
    console.log("Is template:", newCourse.is_template);
    
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
      toast.error("Failed to create course", {
        description: error.message
      });
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

export const updateCourse = async (id: string, courseData: CourseFormData): Promise<Course | null> => {
  try {
    const updates = mapCourseToDb(courseData);

    console.log("Updating course with ID:", id);
    console.log("Update data:", updates);
    console.log("Is template:", updates.is_template);

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
      toast.error("Failed to update course", {
        description: error.message
      });
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

export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast.error("Failed to delete course", {
        description: error.message
      });
      return false;
    }
    
    toast.success("Course deleted successfully");
    return true;
  } catch (err) {
    toast.error("Failed to delete course", {
      description: err instanceof Error ? err.message : "Unknown error occurred"
    });
    return false;
  }
};
