
import { Course } from "@/types/course";
import { initialCourses } from "@/data/initialCourses";

const COURSES_STORAGE_KEY = 'agile-trainer-courses';

export const loadCourses = (): Course[] => {
  try {
    const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    
    if (storedCourses) {
      // Parse the stored courses and validate image URLs
      const courses = JSON.parse(storedCourses);
      
      // More detailed logging to help debug image inconsistencies
      console.log("Browser:", navigator.userAgent);
      console.log("Loading courses with images:", courses.map((c: Course) => ({ 
        id: c.id, 
        title: c.title,
        imageUrl: c.imageUrl 
      })));
      
      // Check if we need to reset to initial courses (in case of data corruption)
      if (!courses || !Array.isArray(courses) || courses.length === 0) {
        console.warn("Invalid courses data in localStorage, resetting to initial courses");
        return [...initialCourses];
      }
      
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
    // Check if we have valid course data before saving
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      console.warn("Attempting to save invalid course data, operation aborted");
      return;
    }

    // Ensure all courses have their image URLs intact before saving
    const coursesToSave = courses.map(course => {
      // If a course is missing an imageUrl that exists in initialCourses, restore it
      if (!course.imageUrl) {
        const initialCourse = initialCourses.find(ic => ic.id === course.id);
        if (initialCourse && initialCourse.imageUrl) {
          console.log(`Restoring missing image URL for course: ${course.id}`);
          return { ...course, imageUrl: initialCourse.imageUrl };
        }
      }
      return course;
    });

    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(coursesToSave));
    console.log("Saved courses to localStorage:", coursesToSave.length);
    console.log("Course image URLs saved:", coursesToSave.map(c => ({ id: c.id, imageUrl: c.imageUrl })));
  } catch (error) {
    console.error("Error saving courses to storage:", error);
  }
};

// Add a function to reset courses to initial state
export const resetCoursesToInitial = (): void => {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(initialCourses));
    console.log("Reset courses to initial state");
  } catch (error) {
    console.error("Error resetting courses:", error);
  }
};
