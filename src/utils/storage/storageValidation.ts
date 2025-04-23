
import { Course } from "@/types/course";
import { initialCourses } from "@/data/initialCourses";

export const validateCourses = (courses: any): Course[] | null => {
  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    console.warn('[Storage] Invalid course data structure');
    return null;
  }
  
  for (const course of courses) {
    if (!course.id || !course.title) {
      console.warn('[Storage] Course missing required fields:', course);
      return null;
    }
    
    if (!course.imageUrl) {
      const initialCourse = initialCourses.find(ic => ic.id === course.id);
      if (initialCourse && initialCourse.imageUrl) {
        console.log('[Storage] Restoring missing image URL for course:', course.id);
        course.imageUrl = initialCourse.imageUrl;
      }
    }
  }
  
  return courses as Course[];
};

export const verifyStorageIntegrity = (): boolean => {
  try {
    const storedCourses = localStorage.getItem('agile-trainer-courses');
    if (!storedCourses) return false;
    
    const courses = JSON.parse(storedCourses);
    return validateCourses(courses) !== null;
  } catch (e) {
    console.error('[Storage] Storage integrity check failed:', e);
    return false;
  }
};
