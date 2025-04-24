
import { Course, CourseMaterial } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { getCourseById, updateCourse } from "./courseService";

export const addCourseMaterial = async (courseId: string, material: CourseMaterial): Promise<Course | null> => {
  // Get the current course
  const course = await getCourseById(courseId);
  if (!course) {
    return null;
  }
  
  // Add the material to the course
  const materials = [...(course.materials || []), material];
  
  // Update the course with the new materials
  const updatedCourse = await updateCourse(courseId, {
    ...course,
    materials
  });
  
  return updatedCourse;
};

export const removeCourseMaterial = async (courseId: string, materialId: string): Promise<Course | null> => {
  // Get the current course
  const course = await getCourseById(courseId);
  if (!course) {
    return null;
  }
  
  // Filter out the material to be removed
  const materials = (course.materials || []).filter(m => m.id !== materialId);
  
  // Update the course with the filtered materials
  const updatedCourse = await updateCourse(courseId, {
    ...course,
    materials
  });
  
  return updatedCourse;
};
