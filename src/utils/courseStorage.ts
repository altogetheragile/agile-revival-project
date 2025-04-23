
import { Course } from "@/types/course";
import { initialCourses } from "@/data/initialCourses";

const COURSES_STORAGE_KEY = 'agile-trainer-courses';

// Add a debug prefix to make logs more identifiable
const logPrefix = "[CourseStorage]";

export const loadCourses = (): Course[] => {
  try {
    const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    
    if (storedCourses) {
      // Parse the stored courses and validate image URLs
      const courses = JSON.parse(storedCourses);
      
      // Log detailed browser information to help debug cross-browser issues
      console.log(`${logPrefix} Browser: ${navigator.userAgent}`);
      console.log(`${logPrefix} Browser vendor: ${navigator.vendor}`);
      console.log(`${logPrefix} Platform: ${navigator.platform}`);
      
      // Validate all course data is properly structured
      const validCourses = validateCourses(courses);
      
      if (validCourses) {
        return validCourses;
      } else {
        console.warn(`${logPrefix} Course data validation failed, resetting to initial courses`);
        resetCoursesToInitial();
        return [...initialCourses];
      }
    }
  } catch (error) {
    console.error(`${logPrefix} Error loading courses from storage:`, error);
    // In case of any error, reset to initial state
    resetCoursesToInitial();
  }
  
  // Return initial courses if nothing in storage or error occurred
  console.log(`${logPrefix} Using initial courses data`);
  return [...initialCourses];
};

// Validates course data for consistency and completeness
const validateCourses = (courses: any): Course[] | null => {
  // Basic data structure validation
  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    console.warn(`${logPrefix} Invalid course data structure`);
    return null;
  }
  
  // Check for required fields and image URLs
  for (const course of courses) {
    if (!course.id || !course.title) {
      console.warn(`${logPrefix} Course missing required fields:`, course);
      return null;
    }
    
    // Check for missing image URLs and restore from initial data if needed
    if (!course.imageUrl) {
      const initialCourse = initialCourses.find(ic => ic.id === course.id);
      if (initialCourse && initialCourse.imageUrl) {
        console.log(`${logPrefix} Restoring missing image URL for course: ${course.id}`);
        course.imageUrl = initialCourse.imageUrl;
      }
    }
  }
  
  // Log all course images for debugging
  console.log(`${logPrefix} Validated courses with images:`, 
    courses.map((c: Course) => ({ id: c.id, title: c.title, imageUrl: c.imageUrl }))
  );
  
  return courses as Course[];
};

export const saveCourses = (courses: Course[]): void => {
  try {
    // Check if we have valid course data before saving
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      console.warn(`${logPrefix} Attempting to save invalid course data, operation aborted`);
      return;
    }

    // Ensure all courses have their image URLs intact before saving
    const coursesToSave = courses.map(course => {
      // If a course is missing an imageUrl that exists in initialCourses, restore it
      if (!course.imageUrl) {
        const initialCourse = initialCourses.find(ic => ic.id === course.id);
        if (initialCourse && initialCourse.imageUrl) {
          console.log(`${logPrefix} Restoring missing image URL for course: ${course.id}`);
          return { ...course, imageUrl: initialCourse.imageUrl };
        }
      }
      return course;
    });

    // Normalize imageUrls to prevent cross-browser inconsistencies
    const normalizedCourses = coursesToSave.map(course => {
      if (course.imageUrl) {
        // Ensure URLs are absolute and properly formatted
        try {
          const url = new URL(course.imageUrl, window.location.origin);
          course.imageUrl = url.toString();
        } catch (e) {
          console.warn(`${logPrefix} Invalid image URL format for course ${course.id}: ${course.imageUrl}`);
        }
      }
      return course;
    });

    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(normalizedCourses));
    console.log(`${logPrefix} Saved courses to localStorage:`, normalizedCourses.length);
    console.log(`${logPrefix} Course image URLs saved:`, normalizedCourses.map(c => ({ id: c.id, imageUrl: c.imageUrl })));
  } catch (error) {
    console.error(`${logPrefix} Error saving courses to storage:`, error);
  }
};

// Reset courses to initial state and reload the page to refresh all data
export const resetCoursesToInitial = (): void => {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(initialCourses));
    console.log(`${logPrefix} Reset courses to initial state`);
  } catch (error) {
    console.error(`${logPrefix} Error resetting courses:`, error);
  }
};

// Add a way to verify storage integrity
export const verifyStorageIntegrity = (): boolean => {
  try {
    const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!storedCourses) return false;
    
    const courses = JSON.parse(storedCourses);
    return validateCourses(courses) !== null;
  } catch (e) {
    console.error(`${logPrefix} Storage integrity check failed:`, e);
    return false;
  }
};
