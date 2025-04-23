
import { Course } from "@/types/course";
import { initialCourses } from "@/data/initialCourses";

const COURSES_STORAGE_KEY = 'agile-trainer-courses';
const STORAGE_VERSION_KEY = 'agile-trainer-storage-version';
const GLOBAL_CACHE_BUST_KEY = 'agile-trainer-cache-bust';

// Add a debug prefix to make logs more identifiable
const logPrefix = "[CourseStorage]";

// Add a custom event for course data changes
const COURSES_UPDATED_EVENT = 'courses-data-updated';

// Generate a cache-busting version timestamp
const generateVersionId = () => {
  return Date.now().toString();
};

// Update the version timestamp
const updateStorageVersion = () => {
  try {
    const version = generateVersionId();
    localStorage.setItem(STORAGE_VERSION_KEY, version);
    // Also update the global cache bust key
    localStorage.setItem(GLOBAL_CACHE_BUST_KEY, version);
    console.log(`${logPrefix} Updated storage version to: ${version}`);
    return version;
  } catch (error) {
    console.error(`${logPrefix} Failed to update storage version:`, error);
    return null;
  }
};

// Get the current version timestamp
export const getStorageVersion = () => {
  try {
    return localStorage.getItem(STORAGE_VERSION_KEY) || generateVersionId();
  } catch {
    return generateVersionId();
  }
};

// Get global cache bust timestamp
export const getGlobalCacheBust = () => {
  try {
    return localStorage.getItem(GLOBAL_CACHE_BUST_KEY) || generateVersionId();
  } catch {
    return generateVersionId();
  }
};

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
      console.log(`${logPrefix} Storage version: ${getStorageVersion()}`);
      console.log(`${logPrefix} Cache bust key: ${getGlobalCacheBust()}`);
      
      // Validate all course data is properly structured
      const validCourses = validateCourses(courses);
      
      if (validCourses) {
        // Always apply current cache busting to images when loading
        const coursesWithCacheBust = applyCacheBusting(validCourses);
        return coursesWithCacheBust;
      } else {
        console.warn(`${logPrefix} Course data validation failed, resetting to initial courses`);
        resetCoursesToInitial(false); // Don't reload page on validation failure
        return [...initialCourses];
      }
    }
  } catch (error) {
    console.error(`${logPrefix} Error loading courses from storage:`, error);
    // In case of any error, reset to initial state
    resetCoursesToInitial(false); // Don't reload page on error
  }
  
  // Return initial courses if nothing in storage or error occurred
  console.log(`${logPrefix} Using initial courses data`);
  return applyCacheBusting([...initialCourses]);
};

// Apply cache busting to all image URLs
const applyCacheBusting = (courses: Course[]): Course[] => {
  const cacheBust = getGlobalCacheBust();
  return courses.map(course => {
    if (course.imageUrl) {
      // Strip any existing cache busting params
      const baseUrl = course.imageUrl.split('?')[0];
      // Apply new cache busting param
      return {
        ...course,
        imageUrl: `${baseUrl}?v=${cacheBust}`
      };
    }
    return course;
  });
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

    // Update the storage version and global cache bust key to ensure cache busting
    updateStorageVersion();
    
    // Normalize imageUrls to prevent cross-browser inconsistencies
    const normalizedCourses = coursesToSave.map(course => {
      if (course.imageUrl) {
        // Remove old version param if exists
        const baseUrl = course.imageUrl.split('?')[0];
        
        // Add new version param
        const cacheBust = getGlobalCacheBust();
        course.imageUrl = `${baseUrl}?v=${cacheBust}`;
      }
      return course;
    });

    // Save the courses with updated version
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(normalizedCourses));
    
    console.log(`${logPrefix} Saved courses to localStorage:`, normalizedCourses.length);
    console.log(`${logPrefix} Course image URLs saved:`, normalizedCourses.map(c => ({ id: c.id, imageUrl: c.imageUrl })));
    
    // Dispatch custom event to notify other components about the data change
    dispatchCoursesUpdatedEvent();
  } catch (error) {
    console.error(`${logPrefix} Error saving courses to storage:`, error);
  }
};

// Dispatch a custom event when courses are updated
const dispatchCoursesUpdatedEvent = () => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(COURSES_UPDATED_EVENT, { 
      detail: { timestamp: Date.now(), cacheBust: getGlobalCacheBust() } 
    });
    window.dispatchEvent(event);
    console.log(`${logPrefix} Dispatched courses updated event with timestamp: ${Date.now()}`);
    
    // Also update a global flag to help with cross-browser detection
    try {
      localStorage.setItem('agile-trainer-last-update', Date.now().toString());
    } catch (e) {
      console.error(`${logPrefix} Failed to update last-update flag:`, e);
    }
  }
};

// Hard reset function to force all browsers to reload fresh data
export const forceGlobalReset = () => {
  try {
    // Generate a completely new cache bust key
    const newBust = Date.now().toString();
    localStorage.setItem(GLOBAL_CACHE_BUST_KEY, newBust);
    
    // Force a reload with the new cache bust key
    window.location.href = window.location.pathname + "?forcereset=" + newBust;
  } catch (e) {
    console.error(`${logPrefix} Failed to force global reset:`, e);
  }
};

// Reset courses to initial state and optionally reload the page to refresh all data
export const resetCoursesToInitial = (reloadPage = true): void => {
  try {
    // Generate a new cache bust key
    const cacheBust = Date.now().toString();
    localStorage.setItem(GLOBAL_CACHE_BUST_KEY, cacheBust);
    
    // Apply cache busting to initial courses before saving
    const versionedInitialCourses = initialCourses.map(course => {
      if (course.imageUrl) {
        // Remove any existing version params
        const baseUrl = course.imageUrl.split('?')[0];
        // Add new version param
        return {
          ...course,
          imageUrl: `${baseUrl}?v=${cacheBust}`
        };
      }
      return course;
    });
    
    // Update storage version for cache busting
    updateStorageVersion();
    
    // Save the versioned courses
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(versionedInitialCourses));
    console.log(`${logPrefix} Reset courses to initial state with cache busting: ${cacheBust}`);
    
    // Dispatch the custom event
    dispatchCoursesUpdatedEvent();
    
    // Reload page if requested
    if (reloadPage && typeof window !== 'undefined') {
      console.log(`${logPrefix} Reloading page to refresh data...`);
      // Force a hard reload to clear all caches
      window.location.href = window.location.pathname + '?refresh=' + cacheBust;
    }
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

// Add an event listener setup function for components that need to react to course updates
export const setupCourseUpdateListener = (callback: () => void): () => void => {
  if (typeof window === 'undefined') return () => {};
  
  console.log(`${logPrefix} Setting up course update listener`);
  
  // Listen for custom event
  const handleCustomEvent = () => {
    console.log(`${logPrefix} Course update event received, invoking callback`);
    callback();
  };
  window.addEventListener(COURSES_UPDATED_EVENT, handleCustomEvent);
  
  // Also listen for storage events from other tabs/windows
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === COURSES_STORAGE_KEY || e.key === STORAGE_VERSION_KEY || e.key === GLOBAL_CACHE_BUST_KEY || e.key === 'agile-trainer-last-update') {
      console.log(`${logPrefix} Course data changed in another tab/window. Reloading...`);
      window.location.reload();
    }
  };
  window.addEventListener('storage', handleStorageChange);
  
  // Return cleanup function
  return () => {
    console.log(`${logPrefix} Removing course update listeners`);
    window.removeEventListener(COURSES_UPDATED_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageChange);
  };
};
