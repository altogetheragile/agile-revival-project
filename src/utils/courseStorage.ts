import { toast } from "sonner";
import { Course } from "@/types/course";

// Function to load courses from localStorage
export const loadCourses = (): Course[] => {
  try {
    const storedCourses = localStorage.getItem('agile-trainer-courses');
    return storedCourses ? JSON.parse(storedCourses) : [];
  } catch (error) {
    console.error("[CourseStorage] Error loading courses:", error);
    return [];
  }
};

// Function to save courses to localStorage
export const saveCourses = (courses: Course[]): void => {
  try {
    localStorage.setItem('agile-trainer-courses', JSON.stringify(courses));
    localStorage.setItem('agile-trainer-last-update', Date.now().toString());
    localStorage.setItem('agile-trainer-storage-version', Date.now().toString());
  } catch (error) {
    console.error("[CourseStorage] Error saving courses:", error);
    toast.error("Failed to save course data");
  }
};

// Function to reset course data to initial state
export const resetCoursesToInitial = (cacheBust: boolean = false) => {
  console.log("[CourseStorage] Resetting course data...");
  localStorage.removeItem('agile-trainer-courses');
  localStorage.removeItem('agile-trainer-storage-version');
  localStorage.removeItem('agile-trainer-cache-bust');
  localStorage.removeItem('agile-trainer-last-update');
  localStorage.removeItem('agile-trainer-master-image-record');
  localStorage.removeItem('agile-trainer-master-source');
  
  // Force a cache bust by adding a timestamp to the URL
  if (cacheBust) {
    const timestamp = Date.now().toString();
    window.location.href = window.location.href.split('?')[0] + '?reset=' + timestamp;
  } else {
    window.location.reload();
  }
};

// Function to verify storage integrity
export const verifyStorageIntegrity = (): boolean => {
  try {
    const courses = localStorage.getItem('agile-trainer-courses');
    const version = localStorage.getItem('agile-trainer-storage-version');
    
    if (!courses || !version) {
      console.warn("[CourseStorage] Storage integrity check failed: Missing courses or version.");
      return false;
    }
    
    // Add more checks as needed (e.g., parse JSON, check version format)
    
    return true;
  } catch (error) {
    console.error("[CourseStorage] Error during storage integrity check:", error);
    return false;
  }
};

// Function to get the storage version
export const getStorageVersion = (): string | null => {
  return localStorage.getItem('agile-trainer-storage-version');
};

// Function to set up a listener for course updates (example)
export const setupCourseUpdateListener = () => {
  window.addEventListener('storage', (event) => {
    if (event.key === 'agile-trainer-courses') {
      console.log("[CourseStorage] Course data updated in another tab/window.");
      // Optionally, refresh the data or display a notification
    }
  });
};

// Function to get the global cache bust value
export const getGlobalCacheBust = (): string => {
  return localStorage.getItem('agile-trainer-cache-bust') || Date.now().toString();
};

// Function to force a global reset across all browsers
export const forceGlobalReset = () => {
  console.log("[CourseStorage] Forcing global reset...");
  
  // Update the global cache bust to trigger a reset in other tabs/windows
  const timestamp = Date.now().toString();
  localStorage.setItem('agile-trainer-cache-bust', timestamp);
  
  // Reload the current page to reset the current browser
  window.location.href = window.location.href.split('?')[0] + '?forcereset=' + timestamp;
};

// Fix the function signatures to match usage
export const makeThisBrowserMasterSource = () => {
  console.log("[CourseStorage] This browser is now the MASTER SOURCE for images");
  
  // Generate a browser ID if one doesn't exist yet
  ensureBrowserHasId();
  
  // Get the browser ID
  const browserId = localStorage.getItem('agile-trainer-browser-id');

  // Mark this browser as the master source
  localStorage.setItem('agile-trainer-master-source', 'true');
  
  // Get all courses with image URLs
  const courses = loadCourses();
  const coursesWithImages = courses.filter((course: any) => course.imageUrl);
  
  console.log("[CourseStorage] Validated courses with images:", coursesWithImages);
  
  // Create a master record of image URLs
  const masterImageRecord = coursesWithImages.map((course: any) => {
    return {
      id: course.id,
      imageUrl: course.imageUrl.split('?')[0], // Store the base URL without cache parameters
      browserId
    };
  });
  
  // Store the master record
  localStorage.setItem('agile-trainer-master-image-record', JSON.stringify(masterImageRecord));
  console.log("[CourseStorage] Stored master image record:", masterImageRecord);
  
  // Update the global cache bust to force other browsers to refresh
  const timestamp = Date.now().toString();
  localStorage.setItem('agile-trainer-cache-bust', timestamp);
  
  // Reload the page to apply changes immediately
  window.location.href = window.location.href.split('?')[0] + '?master=' + timestamp;
};

// Update synchronizeImageUrls to not require a parameter
export const synchronizeImageUrls = () => {
  // Check if there's a master image record
  const masterRecordStr = localStorage.getItem('agile-trainer-master-image-record');
  
  if (!masterRecordStr) {
    console.log("[CourseStorage] No master image record found. Consider making a browser the master source first.");
    
    // Create a fallback global cache bust to refresh images on all browsers
    const timestamp = Date.now().toString();
    localStorage.setItem('agile-trainer-cache-bust', timestamp);
    
    // Reload to apply the new cache-busting timestamp
    window.location.href = window.location.href.split('?')[0] + '?sync=' + timestamp;
    return;
  }
  
  try {
    // Parse the master record
    const masterRecord = JSON.parse(masterRecordStr);
    console.log("[CourseStorage] Found master image record:", masterRecord);
    
    // Get current courses
    const courses = loadCourses();
    
    // Update course image URLs to match the master record
    const updatedCourses = courses.map((course: any) => {
      const masterEntry = masterRecord.find((record: any) => record.id === course.id);
      
      if (masterEntry && masterEntry.imageUrl) {
        // Replace with the master image URL (just the base URL)
        course.imageUrl = masterEntry.imageUrl;
        console.log(`[CourseStorage] Synchronized image URL for course ${course.id}: ${course.imageUrl}`);
      }
      
      return course;
    });
    
    // Save updated courses
    saveCourses(updatedCourses);
    
    // Update the global cache bust
    const timestamp = Date.now().toString();
    localStorage.setItem('agile-trainer-cache-bust', timestamp);
    
    console.log("[CourseStorage] Synchronization complete.");
    
    // Reload the page to show updated images
    window.location.href = window.location.href.split('?')[0] + '?sync=' + timestamp;
  } catch (e) {
    console.error("[CourseStorage] Error during synchronization:", e);
  }
};

// Helper to ensure browser has an ID
const ensureBrowserHasId = () => {
  if (!localStorage.getItem('agile-trainer-browser-id')) {
    const browserId = `browser-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('agile-trainer-browser-id', browserId);
    console.log("[CourseStorage] Generated new browser ID:", browserId);
  }
};

// Initialize browser ID when this file runs
ensureBrowserHasId();
