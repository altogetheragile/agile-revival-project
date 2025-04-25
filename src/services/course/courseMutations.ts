
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseFormData } from "@/types/course";
import { toast } from "sonner";
import { mapDbToCourse, mapCourseToDb } from "./courseMappers";
import { handleError, showSuccess } from "@/utils/errorHandler";

// Create a new course
export const createCourse = async (courseData: CourseFormData): Promise<Course | null> => {
  try {
    const newCourse = mapCourseToDb(courseData);
    
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
      return handleError(error, "Failed to create course") && null;
    }
    
    showSuccess(newCourse.is_template ? "Template created successfully" : "Course created successfully");
    return mapDbToCourse(data);
  } catch (err) {
    console.error("Unexpected error in createCourse:", err);
    handleError(err, "Failed to create course");
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
      return handleError(error, "Failed to update course") && null;
    }
    
    showSuccess(updates.is_template ? "Template updated successfully" : "Course updated successfully");
    return mapDbToCourse(data);
  } catch (err) {
    console.error("Unexpected error in updateCourse:", err);
    handleError(err, "Failed to update course");
    return null;
  }
};

// Delete a course
export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
      
    if (error) {
      return handleError(error, "Failed to delete course") && false;
    }
    
    showSuccess("Course deleted successfully");
    return true;
  } catch (err) {
    handleError(err, "Failed to delete course");
    return false;
  }
};
