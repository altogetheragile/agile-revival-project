
import { Course } from "@/types/course";
import { initialCourses } from "@/data/initialCourses";
import { getGlobalCacheBust, updateStorageVersion, setGlobalCacheBust } from './storage/cacheBusting';
import { dispatchCoursesUpdatedEvent, setupCourseUpdateListener } from './storage/storageEvents';
import { validateCourses, verifyStorageIntegrity } from './storage/storageValidation';

const COURSES_STORAGE_KEY = 'agile-trainer-courses';

export const loadCourses = (): Course[] => {
  try {
    const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    
    if (storedCourses) {
      const courses = JSON.parse(storedCourses);
      const validCourses = validateCourses(courses);
      
      if (validCourses) {
        const coursesWithCacheBust = applyCacheBusting(validCourses);
        return coursesWithCacheBust;
      } else {
        console.warn('[Storage] Course data validation failed, resetting to initial courses');
        resetCoursesToInitial(false);
        return [...initialCourses];
      }
    }
  } catch (error) {
    console.error('[Storage] Error loading courses from storage:', error);
    resetCoursesToInitial(false);
  }
  
  return applyCacheBusting([...initialCourses]);
};

const applyCacheBusting = (courses: Course[]): Course[] => {
  const cacheBust = getGlobalCacheBust();
  return courses.map(course => {
    if (course.imageUrl) {
      const baseUrl = course.imageUrl.split('?')[0];
      return {
        ...course,
        imageUrl: `${baseUrl}?v=${cacheBust}`
      };
    }
    return course;
  });
};

export const saveCourses = (courses: Course[]): void => {
  try {
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      console.warn('[Storage] Attempting to save invalid course data, operation aborted');
      return;
    }

    const coursesToSave = courses.map(course => {
      if (!course.imageUrl) {
        const initialCourse = initialCourses.find(ic => ic.id === course.id);
        if (initialCourse && initialCourse.imageUrl) {
          console.log('[Storage] Restoring missing image URL for course:', course.id);
          return { ...course, imageUrl: initialCourse.imageUrl };
        }
      }
      return course;
    });

    updateStorageVersion();
    
    const normalizedCourses = coursesToSave.map(course => {
      if (course.imageUrl) {
        const baseUrl = course.imageUrl.split('?')[0];
        const cacheBust = getGlobalCacheBust();
        course.imageUrl = `${baseUrl}?v=${cacheBust}`;
      }
      return course;
    });

    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(normalizedCourses));
    dispatchCoursesUpdatedEvent();
  } catch (error) {
    console.error('[Storage] Error saving courses to storage:', error);
  }
};

export const forceGlobalReset = () => {
  try {
    const newBust = Date.now().toString();
    setGlobalCacheBust(newBust);
    window.location.href = window.location.pathname + "?forcereset=" + newBust;
  } catch (e) {
    console.error('[Storage] Failed to force global reset:', e);
  }
};

export const resetCoursesToInitial = (reloadPage = true): void => {
  try {
    const cacheBust = Date.now().toString();
    setGlobalCacheBust(cacheBust);
    
    const versionedInitialCourses = initialCourses.map(course => {
      if (course.imageUrl) {
        const baseUrl = course.imageUrl.split('?')[0];
        return {
          ...course,
          imageUrl: `${baseUrl}?v=${cacheBust}`
        };
      }
      return course;
    });
    
    updateStorageVersion();
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(versionedInitialCourses));
    dispatchCoursesUpdatedEvent();
    
    if (reloadPage && typeof window !== 'undefined') {
      console.log('[Storage] Reloading page to refresh data...');
      window.location.href = window.location.pathname + '?refresh=' + cacheBust;
    }
  } catch (error) {
    console.error('[Storage] Error resetting courses:', error);
  }
};

// Re-export utility functions
export {
  getGlobalCacheBust,
  setGlobalCacheBust,
  setupCourseUpdateListener,
  verifyStorageIntegrity
};
