
import { cleanupPrevious, loadScript, loadStyle, createWidgetContainer } from './domUtils';
import { log, MAX_ATTEMPTS, EMBED_ID } from './utils';

// Track loading state
let isLoading = false;
let scriptAttempts = 0;

// Create fallback CSS for when external stylesheet fails to load
const addFallbackStyles = () => {
  log('Adding fallback styles');
  const style = document.createElement('style');
  style.textContent = `
    .sk-ww-linkedin-recommendations {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 1rem;
    }
    .sk-ww-linkedin-recommendations-item {
      margin-bottom: 1.5rem;
      padding: 1.25rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      background-color: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .sk-ww-linkedin-recommendations-reviewer-image {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      margin-right: 0.75rem;
      object-fit: cover;
    }
    .sk-ww-linkedin-recommendations-text {
      margin-top: 0.75rem;
      line-height: 1.5;
    }
    .sk-ww-linkedin-recommendations-reviewer {
      display: flex;
      align-items: center;
    }
    .sk-ww-linkedin-recommendations-reviewer-name {
      font-weight: 600;
      color: #0a66c2;
      text-decoration: none;
    }
    .sk-ww-linkedin-recommendations-reviewer-title {
      font-size: 0.875rem;
      color: #666;
    }
  `;
  document.head.appendChild(style);
  return style;
};

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
  
  // Reference to any fallback styles we might create
  let fallbackStyleElement: HTMLStyleElement | null = null;
  
  // Start the async loading process
  const doLoad = async () => {
    try {
      log(`Initializing SociableKit (attempt ${scriptAttempts + 1}/${MAX_ATTEMPTS})`);
      
      // First try to load the stylesheet with cache busting
      const styleUrl = `https://widgets.sociablekit.com/linkedin-recommendations/widget.css?${timestamp}`;
      try {
        await loadStyle(styleUrl);
        log('External stylesheet loaded successfully');
      } catch (styleError) {
        log('Failed to load external stylesheet, using fallback styles', styleError);
        fallbackStyleElement = addFallbackStyles();
      }
      
      // Then load the script with cache busting
      const scriptUrl = `https://widgets.sociablekit.com/linkedin-recommendations/widget.js?${timestamp}`;
      await loadScript(scriptUrl, 15000);  // 15 second timeout
      
      // If we get here, script loaded successfully
      // Create a container if one doesn't exist yet
      const containers = document.querySelectorAll('.sk-ww-linkedin-recommendations');
      if (containers.length === 0) {
        log('No containers found, creating one');
        const container = createWidgetContainer();
        container.style.display = 'none';
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
    
    // Remove the fallback style if we created one
    if (fallbackStyleElement && fallbackStyleElement.parentNode) {
      fallbackStyleElement.parentNode.removeChild(fallbackStyleElement);
    }
  };
};
