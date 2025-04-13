
import { cleanupPrevious, loadScript, loadStyle, createWidgetContainer, isWidgetLoaded } from './domUtils';
import { log, MAX_ATTEMPTS, EMBED_ID } from './utils';

// Track loading state
let isLoading = false;
let scriptAttempts = 0;

// Initialization with retries - returns a cleanup function, not a Promise
export const initSociableKit = (): (() => void) => {
  // Prevent multiple initializations at once
  if (isLoading) {
    log('Already loading, ignoring request');
    return () => {}; // Return empty function
  }
  
  isLoading = true;
  cleanupPrevious();
  
  // Cache busting timestamp
  const timestamp = new Date().getTime();
  
  // Start the async loading process without blocking
  const doLoad = async () => {
    try {
      log(`Initializing SociableKit (attempt ${scriptAttempts + 1}/${MAX_ATTEMPTS})`);
      
      // First try to load the stylesheet with cache busting
      const styleUrl = `https://widgets.sociablekit.com/linkedin-recommendations/widget.css?${timestamp}`;
      await loadStyle(styleUrl);
      
      // Then load the script with cache busting and retry capability
      const scriptUrl = `https://widgets.sociablekit.com/linkedin-recommendations/widget.js?${timestamp}`;
      await loadScript(scriptUrl, 15000, 2);  // 15 second timeout, 2 retries
      
      // If we get here, script loaded successfully
      // Create a container if one doesn't exist yet
      const containers = document.querySelectorAll('.sk-ww-linkedin-recommendations');
      if (containers.length === 0) {
        log('No containers found, creating one');
        const container = createWidgetContainer();
        container.style.display = 'none'; // Hide it to prevent flashing
        document.body.appendChild(container);
      }
      
      // Reset attempt counter on success
      scriptAttempts = 0;
      log('SociableKit initialized successfully');
      
    } catch (error) {
      scriptAttempts++;
      log(`Initialization failed (attempt ${scriptAttempts}/${MAX_ATTEMPTS})`, error);
      
      // If we haven't hit max attempts, retry after delay
      if (scriptAttempts < MAX_ATTEMPTS) {
        log(`Retrying in 2 seconds...`);
        setTimeout(() => {
          isLoading = false;
          doLoad();
        }, 2000);
      } else {
        log('Max retry attempts reached, giving up');
        scriptAttempts = 0; // Reset for next time
        isLoading = false;
      }
    } finally {
      isLoading = false;
    }
  };
  
  // Start the loading process without awaiting it
  doLoad();
  
  // Return a synchronous cleanup function
  return () => {
    log('Cleanup function called');
    cleanupPrevious();
  };
};
