
import { Course } from "@/types/course";
import { initialCourses } from "@/data/initialCourses";

const COURSES_STORAGE_KEY = 'agile-trainer-courses';

export const loadCourses = (): Course[] => {
  try {
    const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    
    if (storedCourses) {
      // Parse the stored courses and validate image URLs
      const courses = JSON.parse(storedCourses);
      
      // Log all course image URLs for debugging
      console.log("Loading courses with images:", courses.map((c: Course) => ({ 
        id: c.id, 
        title: c.title,
        imageUrl: c.imageUrl 
      })));
      
      return courses;
    }
  } catch (error) {
    console.error("Error loading courses from storage:", error);
  }
  
  // Return initial courses if nothing in storage or error occurred
  console.log("Using initial courses data");
  return [...initialCourses];
};

export const saveCourses = (courses: Course[]): void => {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
    console.log("Saved courses to localStorage:", courses.length);
  } catch (error) {
    console.error("Error saving courses to storage:", error);
  }
};
