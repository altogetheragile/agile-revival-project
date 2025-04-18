
import { Course, CourseMaterial } from "@/types/course";
import { loadCourses, saveCourses } from "@/utils/courseStorage";

export const addCourseMaterial = (courseId: string, material: CourseMaterial): Course | null => {
  const courses = loadCourses();
  const index = courses.findIndex(course => course.id === courseId);
  
  if (index === -1) {
    return null;
  }
  
  const course = courses[index];
  const materials = [...(course.materials || []), material];
  
  const updatedCourse: Course = {
    ...course,
    materials
  };
  
  courses[index] = updatedCourse;
  saveCourses(courses);
  
  return updatedCourse;
};

export const removeCourseMaterial = (courseId: string, materialId: string): Course | null => {
  const courses = loadCourses();
  const index = courses.findIndex(course => course.id === courseId);
  
  if (index === -1) {
    return null;
  }
  
  const course = courses[index];
  const materials = (course.materials || []).filter(m => m.id !== materialId);
  
  const updatedCourse: Course = {
    ...course,
    materials
  };
  
  courses[index] = updatedCourse;
  saveCourses(courses);
  
  return updatedCourse;
};
