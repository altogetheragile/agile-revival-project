import { Course } from "@/types/course";
import { initialCourses } from "@/data/initialCourses";

const COURSES_STORAGE_KEY = 'agile-trainer-courses';
const STORAGE_VERSION_KEY = 'agile-trainer-storage-version';
const GLOBAL_CACHE_BUST_KEY = 'agile-trainer-cache-bust';
const MASTER_IMAGE_KEY = 'agile-trainer-master-images';
const MASTER_SOURCE_TRACKER = 'agile-trainer-master-source';
const LAST_SYNC_TIME_KEY = 'agile-trainer-last-sync';
const BROWSER_ID_KEY = 'agile-trainer-browser-id';

const logPrefix = "[CourseStorage]";
const COURSES_UPDATED_EVENT = 'courses-data-updated';

const getBrowserId = () => {
  let id = localStorage.getItem(BROWSER_ID_KEY);
  if (!id) {
    id = `browser-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    try {
      localStorage.setItem(BROWSER_ID_KEY, id);
    } catch (e) {
      console.error(`${logPrefix} Failed to store browser ID:`, e);
    }
  }
  return id;
};

const generateVersionId = () => {
  return Date.now().toString();
};

const updateStorageVersion = () => {
  try {
    const version = generateVersionId();
    localStorage.setItem(STORAGE_VERSION_KEY, version);
    localStorage.setItem(GLOBAL_CACHE_BUST_KEY, version);
    console.log(`${logPrefix} Updated storage version to: ${version}`);
    return version;
  } catch (error) {
    console.error(`${logPrefix} Failed to update storage version:`, error);
    return null;
  }
};

export const getStorageVersion = () => {
  try {
    return localStorage.getItem(STORAGE_VERSION_KEY) || generateVersionId();
  } catch {
    return generateVersionId();
  }
};

export const getGlobalCacheBust = () => {
  try {
    return localStorage.getItem(GLOBAL_CACHE_BUST_KEY) || generateVersionId();
  } catch {
    return generateVersionId();
  }
};

const storeMasterImageRecord = (courses: Course[], browserSource = false) => {
  try {
    const imageMap = courses.map(course => ({
      id: course.id,
      imageUrl: course.imageUrl ? course.imageUrl.split('?')[0] : null,
      lastUpdated: Date.now(),
      browserId: getBrowserId()
    }));
    
    localStorage.setItem(MASTER_IMAGE_KEY, JSON.stringify(imageMap));
    localStorage.setItem(LAST_SYNC_TIME_KEY, Date.now().toString());
    
    if (browserSource) {
      localStorage.setItem(MASTER_SOURCE_TRACKER, 'true');
      console.log(`${logPrefix} This browser is now the MASTER SOURCE for images`);
    }
    
    console.log(`${logPrefix} Stored master image record:`, imageMap);
  } catch (error) {
    console.error(`${logPrefix} Failed to store master image record:`, error);
  }
};

const getMasterImageRecord = () => {
  try {
    const record = localStorage.getItem(MASTER_IMAGE_KEY);
    if (record) {
      return JSON.parse(record);
    }
  } catch (error) {
    console.error(`${logPrefix} Failed to get master image record:`, error);
  }
  return null;
};

export const synchronizeImageUrls = (forceMasterSource = false) => {
  try {
    console.log(`${logPrefix} Starting image URL synchronization...`);
    console.log(`${logPrefix} Browser ID: ${getBrowserId()}`);
    
    const currentCourses = loadCourses();
    let masterRecord = getMasterImageRecord();
    const isMasterSource = localStorage.getItem(MASTER_SOURCE_TRACKER) === 'true';
    
    if (forceMasterSource || !masterRecord) {
      storeMasterImageRecord(currentCourses, true);
      masterRecord = currentCourses.map(course => ({
        id: course.id,
        imageUrl: course.imageUrl ? course.imageUrl.split('?')[0] : null,
        lastUpdated: Date.now(),
        browserId: getBrowserId()
      }));
      console.log(`${logPrefix} Created new master image record as the authoritative source:`, masterRecord);
    } else if (!isMasterSource) {
      console.log(`${logPrefix} Using existing master image record:`, masterRecord);
    }
    
    const synchronizedCourses = currentCourses.map(course => {
      const masterImage = masterRecord.find((record: any) => record.id === course.id);
      
      if (masterImage && masterImage.imageUrl) {
        const masterBaseUrl = masterImage.imageUrl.split('?')[0];
        const currentBaseUrl = course.imageUrl ? course.imageUrl.split('?')[0] : null;
        
        if (currentBaseUrl !== masterBaseUrl) {
          console.log(`${logPrefix} Synchronizing image for course ${course.id}:`);
          console.log(`  - From: ${currentBaseUrl}`);
          console.log(`  - To: ${masterBaseUrl}`);
          
          return {
            ...course,
            imageUrl: masterBaseUrl
          };
        }
      }
      
      return course;
    });
    
    const newBust = generateVersionId();
    
    const finalizedCourses = synchronizedCourses.map(course => {
      if (course.imageUrl) {
        const baseUrl = course.imageUrl.split('?')[0];
        return {
          ...course,
          imageUrl: `${baseUrl}?v=${newBust}`
        };
      }
      return course;
    });
    
    localStorage.setItem(GLOBAL_CACHE_BUST_KEY, newBust);
    console.log(`${logPrefix} Updated global cache bust key: ${newBust}`);
    
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(finalizedCourses));
    console.log(`${logPrefix} Saved synchronized courses`);
    
    storeMasterImageRecord(finalizedCourses, isMasterSource);
    
    dispatchCoursesUpdatedEvent();
    
    window.location.href = window.location.pathname + "?sync=" + newBust;
    
    return true;
  } catch (error) {
    console.error(`${logPrefix} Error synchronizing image URLs:`, error);
    return false;
  }
};

export const makeThisBrowserMasterSource = () => {
  try {
    const currentCourses = loadCourses();
    
    const newBust = generateVersionId();
    localStorage.setItem(GLOBAL_CACHE_BUST_KEY, newBust);
    localStorage.setItem(MASTER_SOURCE_TRACKER, 'true');
    
    storeMasterImageRecord(currentCourses, true);
    
    console.log(`${logPrefix} This browser (ID: ${getBrowserId()}) is now the MASTER SOURCE for all image URLs`);
    console.log(`${logPrefix} Browser: ${navigator.userAgent}`);
    console.log(`${logPrefix} Vendor: ${navigator.vendor}`);
    console.log(`${logPrefix} Platform: ${navigator.platform}`);
    
    synchronizeImageUrls(true);
    
    return true;
  } catch (error) {
    console.error(`${logPrefix} Failed to make this browser the master source:`, error);
    return false;
  }
};

export const loadCourses = (): Course[] => {
  try {
    const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    
    if (storedCourses) {
      const courses = JSON.parse(storedCourses);
      
      console.log(`${logPrefix} Browser ID: ${getBrowserId()}`);
      console.log(`${logPrefix} Browser: ${navigator.userAgent}`);
      console.log(`${logPrefix} Browser vendor: ${navigator.vendor}`);
      console.log(`${logPrefix} Platform: ${navigator.platform}`);
      console.log(`${logPrefix} Storage version: ${getStorageVersion()}`);
      console.log(`${logPrefix} Cache bust key: ${getGlobalCacheBust()}`);
      console.log(`${logPrefix} Is master source: ${localStorage.getItem(MASTER_SOURCE_TRACKER) === 'true'}`);
      console.log(`${logPrefix} Last sync: ${localStorage.getItem(LAST_SYNC_TIME_KEY) || 'Never'}`);
      
      const validCourses = validateCourses(courses);
      
      if (validCourses) {
        const coursesWithCacheBust = applyCacheBusting(validCourses);
        
        if (localStorage.getItem(MASTER_SOURCE_TRACKER) === 'true') {
          storeMasterImageRecord(coursesWithCacheBust, true);
        }
        
        return coursesWithCacheBust;
      } else {
        console.warn(`${logPrefix} Course data validation failed, resetting to initial courses`);
        resetCoursesToInitial(false);
        return [...initialCourses];
      }
    }
  } catch (error) {
    console.error(`${logPrefix} Error loading courses from storage:`, error);
    resetCoursesToInitial(false);
  }
  
  console.log(`${logPrefix} Using initial courses data`);
  const initialWithCache = applyCacheBusting([...initialCourses]);
  storeMasterImageRecord(initialWithCache);
  return initialWithCache;
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

const validateCourses = (courses: any): Course[] | null => {
  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    console.warn(`${logPrefix} Invalid course data structure`);
    return null;
  }
  
  for (const course of courses) {
    if (!course.id || !course.title) {
      console.warn(`${logPrefix} Course missing required fields:`, course);
      return null;
    }
    
    if (!course.imageUrl) {
      const initialCourse = initialCourses.find(ic => ic.id === course.id);
      if (initialCourse && initialCourse.imageUrl) {
        console.log(`${logPrefix} Restoring missing image URL for course: ${course.id}`);
        course.imageUrl = initialCourse.imageUrl;
      }
    }
  }
  
  console.log(`${logPrefix} Validated courses with images:`, 
    courses.map((c: Course) => ({ id: c.id, title: c.title, imageUrl: c.imageUrl }))
  );
  
  return courses as Course[];
};

export const saveCourses = (courses: Course[]): void => {
  try {
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      console.warn(`${logPrefix} Attempting to save invalid course data, operation aborted`);
      return;
    }
    
    const coursesToSave = courses.map(course => {
      if (!course.imageUrl) {
        const initialCourse = initialCourses.find(ic => ic.id === course.id);
        if (initialCourse && initialCourse.imageUrl) {
          console.log(`${logPrefix} Restoring missing image URL for course: ${course.id}`);
          return { ...course, imageUrl: initialCourse.imageUrl };
        }
      }
      return course;
    });
    
    updateStorageVersion();
    
    const normalizedCourses = coursesToSave.map(course => {
      if (course.imageUrl) {
        const baseUrl = course.imageUrl.split('?')[0];
        course.imageUrl = `${baseUrl}?v=${getGlobalCacheBust()}`;
      }
      return course;
    });
    
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(normalizedCourses));
    
    console.log(`${logPrefix} Saved courses to localStorage:`, normalizedCourses.length);
    console.log(`${logPrefix} Course image URLs saved:`, normalizedCourses.map(c => ({ id: c.id, imageUrl: c.imageUrl })));
    
    dispatchCoursesUpdatedEvent();
  } catch (error) {
    console.error(`${logPrefix} Error saving courses to storage:`, error);
  }
};

const dispatchCoursesUpdatedEvent = () => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(COURSES_UPDATED_EVENT, { 
      detail: { 
        timestamp: Date.now(), 
        cacheBust: getGlobalCacheBust(),
        browserId: getBrowserId()
      } 
    });
    window.dispatchEvent(event);
    console.log(`${logPrefix} Dispatched courses updated event with timestamp: ${Date.now()}`);
    
    try {
      localStorage.setItem('agile-trainer-last-update', Date.now().toString());
    } catch (e) {
      console.error(`${logPrefix} Failed to update last-update flag:`, e);
    }
  }
};

export const forceGlobalReset = () => {
  try {
    const newBust = Date.now().toString();
    localStorage.setItem(GLOBAL_CACHE_BUST_KEY, newBust);
    localStorage.removeItem(MASTER_SOURCE_TRACKER);
    
    const initialWithCache = initialCourses.map(course => {
      if (course.imageUrl) {
        const baseUrl = course.imageUrl.split('?')[0];
        return {
          ...course,
          imageUrl: `${baseUrl}?v=${newBust}`
        };
      }
      return course;
    });
    
    updateStorageVersion();
    
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(initialWithCache));
    console.log(`${logPrefix} Performed nuclear reset with cache busting: ${newBust}`);
    
    storeMasterImageRecord(initialWithCache);
    
    window.location.href = window.location.pathname + "?forcereset=" + newBust;
  } catch (e) {
    console.error(`${logPrefix} Failed to force global reset:`, e);
  }
};

export const resetCoursesToInitial = (reloadPage = true): void => {
  try {
    const cacheBust = Date.now().toString();
    localStorage.setItem(GLOBAL_CACHE_BUST_KEY, cacheBust);
    localStorage.removeItem(MASTER_SOURCE_TRACKER);
    
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
    console.log(`${logPrefix} Reset courses to initial state with cache busting: ${cacheBust}`);
    
    storeMasterImageRecord(versionedInitialCourses);
    
    dispatchCoursesUpdatedEvent();
    
    if (reloadPage && typeof window !== 'undefined') {
      console.log(`${logPrefix} Reloading page to refresh data...`);
      window.location.href = window.location.pathname + '?refresh=' + cacheBust;
    }
  } catch (error) {
    console.error(`${logPrefix} Error resetting courses:`, error);
  }
};

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

export const setupCourseUpdateListener = (callback: () => void): () => void => {
  if (typeof window === 'undefined') return () => {};
  
  console.log(`${logPrefix} Setting up course update listener`);
  
  const handleCustomEvent = () => {
    console.log(`${logPrefix} Course update event received, invoking callback`);
    callback();
  };
  window.addEventListener(COURSES_UPDATED_EVENT, handleCustomEvent);
  
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === COURSES_STORAGE_KEY || 
        e.key === STORAGE_VERSION_KEY || 
        e.key === GLOBAL_CACHE_BUST_KEY || 
        e.key === 'agile-trainer-last-update' ||
        e.key === MASTER_SOURCE_TRACKER) {
      console.log(`${logPrefix} Course data changed in another tab/window. Reloading...`);
      window.location.reload();
    }
  };
  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    console.log(`${logPrefix} Removing course update listeners`);
    window.removeEventListener(COURSES_UPDATED_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageChange);
  };
};
