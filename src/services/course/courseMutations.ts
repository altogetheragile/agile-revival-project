
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
    
    toast.success("Course created successfully");
    return mapDbToCourse(data);
  } catch (err) {
    console.error("Unexpected error creating course:", err);
    toast.error("Failed to create course", {
      description: "There was an unexpected error creating the course."
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
    
    toast.success("Course updated successfully");
    return mapDbToCourse(data);
  } catch (err) {
    console.error("Unexpected error updating course:", err);
    toast.error("Failed to update course", {
      description: "There was an unexpected error updating the course."
    });
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
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
      return false;
    }
    
    toast.success("Course deleted successfully");
    return true;
  } catch (err) {
    console.error("Unexpected error deleting course:", err);
    toast.error("Failed to delete course");
    return false;
  }
};
