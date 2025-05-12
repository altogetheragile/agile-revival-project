
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseFormData } from "@/types/course";
import { toast } from "sonner";
import { mapDbToCourse, mapCourseToDb } from "./courseMappers";
import { executeQuery } from "@/utils/supabase/query";

export const createCourse = async (courseData: CourseFormData): Promise<Course | null> => {
  try {
    console.log("Creating course with data:", courseData);
    
    // Check if user is authenticated using executeQuery for better error handling
    const { data: userData, error: userError } = await executeQuery(
      async (signal) => await supabase.auth.getUser(),
      {
        timeoutMs: 20000,
        showErrorToast: true,
        errorMessage: "Authentication check failed",
        retries: 2
      }
    );
    
    const user = userData?.user;
    
    if (userError || !user) {
      console.error("User not authenticated or error getting user:", userError);
      toast.error("Authentication required", {
        description: "You must be logged in to perform this action."
      });
      return null;
    }

    // If this is a template, verify admin role with optimized query
    if (courseData.isTemplate) {
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
          description: "Admin privileges required to create templates."
        });
        return null;
      }
    }

    const dbCourseData = mapCourseToDb(courseData);
    
    const newCourse = {
      ...dbCourseData,
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
    
    // Use executeQuery helper with proper timeouts and retries
    const { data, error } = await executeQuery<any>(
      (signal) => supabase
        .from('courses')
        .insert(newCourse)
        .select()
        .abortSignal(signal)
        .single(),
      {
        timeoutMs: 30000, // Increased timeout for course operations
        showErrorToast: true,
        errorMessage: "Failed to create course",
        retries: 2
      }
    );
      
    if (error) {
      console.error("Error creating course:", error);
      
      // Enhanced error messaging
      let errorMessage = "Failed to create course";
      if (error.message?.includes('violates row-level security policy')) {
        errorMessage = "Permission issue: You don't have the required permissions";
      } else if (error.message?.includes('timed out') || error.message?.includes('connection')) {
        errorMessage = "Database connection issue: Please try again";
      }
      
      toast.error("Failed to create course", {
        description: errorMessage
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
    console.log("Updating course:", id, courseData);
    
    // Check if user is authenticated with better error handling
    const { data: userData, error: userError } = await executeQuery(
      async (signal) => await supabase.auth.getUser(),
      {
        timeoutMs: 20000,
        showErrorToast: true,
        errorMessage: "Authentication check failed",
        retries: 2
      }
    );
    
    const user = userData?.user;
    
    if (userError || !user) {
      console.error("User not authenticated or error getting user:", userError);
      toast.error("Authentication required", {
        description: "You must be logged in to perform this action."
      });
      return null;
    }

    // If this is a template, verify admin role
    if (courseData.isTemplate) {
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
          description: "Admin privileges required to update templates."
        });
        return null;
      }
    }

    const dbCourseData = mapCourseToDb(courseData);
    
    // Ensure the ID is not in the update data
    const { id: _, ...updateData } = dbCourseData;
    
    // Use optimized query with better error handling
    const { data, error } = await executeQuery<any>(
      (signal) => supabase
        .from('courses')
        .update({ 
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .abortSignal(signal)
        .single(),
      {
        timeoutMs: 30000, // Increased timeout for course operations
        showErrorToast: true,
        errorMessage: "Failed to update course",
        retries: 2
      }
    );

    if (error) {
      console.error("Error updating course:", error);
      
      // Enhanced error messaging
      let errorMessage = "Failed to update course";
      if (error.message?.includes('violates row-level security policy')) {
        errorMessage = "Permission issue: You don't have the required permissions";
      } else if (error.message?.includes('timed out') || error.message?.includes('connection')) {
        errorMessage = "Database connection issue: Please try again";
      }
      
      toast.error("Failed to update course", {
        description: errorMessage
      });
      
      return null;
    }

    toast.success(courseData.isTemplate ? "Template updated successfully" : "Course updated successfully");
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
    console.log("Deleting course:", id);
    
    // Check if user is authenticated with better error handling
    const { data: userData, error: userError } = await executeQuery(
      async (signal) => await supabase.auth.getUser(),
      {
        timeoutMs: 20000,
        showErrorToast: true,
        errorMessage: "Authentication check failed",
        retries: 2
      }
    );
    
    const user = userData?.user;
    
    if (userError || !user) {
      console.error("User not authenticated or error getting user:", userError);
      toast.error("Authentication required", {
        description: "You must be logged in to perform this action."
      });
      return false;
    }

    // Verify admin role with better error handling
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
      return false;
    }

    if (!isAdmin) {
      console.error("User lacks admin role:", user.id);
      toast.error("Access denied", {
        description: "Admin privileges required to delete courses."
      });
      return false;
    }

    // Use optimized query with better error handling
    const { error } = await executeQuery<any>(
      (signal) => supabase
        .from('courses')
        .delete()
        .eq('id', id)
        .abortSignal(signal),
      {
        timeoutMs: 20000,
        showErrorToast: true,
        errorMessage: "Failed to delete course",
        retries: 2
      }
    );

    if (error) {
      console.error("Error deleting course:", error);
      
      // Enhanced error messaging
      let errorMessage = "Failed to delete course";
      if (error.message?.includes('violates row-level security policy')) {
        errorMessage = "Permission issue: You don't have the required permissions";
      } else if (error.message?.includes('timed out') || error.message?.includes('connection')) {
        errorMessage = "Database connection issue: Please try again";
      }
      
      toast.error("Failed to delete course", {
        description: errorMessage
      });
      
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
