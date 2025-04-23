
import { getGlobalCacheBust } from './cacheBusting';

const COURSES_UPDATED_EVENT = 'courses-data-updated';

export const dispatchCoursesUpdatedEvent = () => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(COURSES_UPDATED_EVENT, { 
      detail: { timestamp: Date.now(), cacheBust: getGlobalCacheBust() } 
    });
    window.dispatchEvent(event);
    console.log('[Storage] Dispatched courses updated event:', Date.now());
    
    try {
      localStorage.setItem('agile-trainer-last-update', Date.now().toString());
    } catch (e) {
      console.error('[Storage] Failed to update last-update flag:', e);
    }
  }
};

export const setupCourseUpdateListener = (callback: () => void): () => void => {
  if (typeof window === 'undefined') return () => {};
  
  console.log('[Storage] Setting up course update listener');
  
  const handleCustomEvent = () => {
    console.log('[Storage] Course update event received, invoking callback');
    callback();
  };
  
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'agile-trainer-courses' || 
        e.key === 'agile-trainer-storage-version' || 
        e.key === 'agile-trainer-cache-bust' || 
        e.key === 'agile-trainer-last-update') {
      console.log('[Storage] Course data changed in another tab/window. Reloading...');
      window.location.reload();
    }
  };
  
  window.addEventListener(COURSES_UPDATED_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener(COURSES_UPDATED_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageChange);
  };
};
