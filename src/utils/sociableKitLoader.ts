
/**
 * Utility to load and initialize SociableKIT widgets
 */

// Track loading state
let isLoading = false;
let scriptAttempts = 0;
const MAX_ATTEMPTS = 5;
const EMBED_ID = '166933';
const DEBUG = true;

// Function to log messages conditionally
const log = (message: string, ...args: any[]) => {
  if (DEBUG) {
    console.log(`[SociableKit] ${message}`, ...args);
  }
};

// Store instances of loaded scripts and styles
let currentScript: HTMLScriptElement | null = null;
let currentStyle: HTMLLinkElement | null = null;

// Clean up previous instances of the widget
const cleanupPrevious = () => {
  log('Cleaning up previous instances');
  
  // Remove script tag if it exists
  if (currentScript && document.body.contains(currentScript)) {
    document.body.removeChild(currentScript);
    currentScript = null;
  }
  
  // Remove style tag if it exists
  if (currentStyle && document.head.contains(currentStyle)) {
    document.head.removeChild(currentStyle);
    currentStyle = null;
  }
  
  // Remove any existing widget containers
  const containers = document.querySelectorAll('.sk-ww-linkedin-recommendations');
  containers.forEach(container => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  // Reset global objects
  if (window.SK_LINKEDIN_RECOMMENDATIONS) {
    try {
      // @ts-ignore
      window.SK_LINKEDIN_RECOMMENDATIONS = undefined;
    } catch (e) {
      log('Error resetting global object', e);
    }
  }
};

// Create container element for widget
export const createWidgetContainer = (parent: HTMLElement | null = null) => {
  log('Creating widget container');
  
  const container = document.createElement('div');
  container.className = 'sk-ww-linkedin-recommendations';
  container.setAttribute('data-embed-id', EMBED_ID);
  
  // If parent is provided, append to parent, otherwise just return
  if (parent) {
    parent.appendChild(container);
    log('Container appended to parent');
  }
  
  return container;
};

// Promise-based script loading
const loadScript = (url: string, timeout = 10000): Promise<void> => {
  return new Promise((resolve, reject) => {
    log(`Loading script: ${url}`);
    
    // Create script element
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    
    // Set up onload handler
    script.onload = () => {
      log('Script loaded successfully');
      resolve();
    };
    
    // Set up error handler
    script.onerror = (error) => {
      log('Script loading error', error);
      reject(new Error('Script failed to load'));
    };
    
    // Set timeout
    const timeoutId = setTimeout(() => {
      log('Script loading timed out');
      reject(new Error('Script loading timed out'));
    }, timeout);
    
    // Add to document
    document.body.appendChild(script);
    currentScript = script;
    
    // Clean up timeout on success or error
    script.addEventListener('load', () => clearTimeout(timeoutId));
    script.addEventListener('error', () => clearTimeout(timeoutId));
  });
};

// Promise-based style loading
const loadStyle = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    log(`Loading style: ${url}`);
    
    // Create link element
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    
    // Set up handlers
    link.onload = () => {
      log('Style loaded successfully');
      resolve();
    };
    
    link.onerror = (error) => {
      log('Style loading error', error);
      reject(new Error('Style failed to load'));
    };
    
    // Add to document
    document.head.appendChild(link);
    currentStyle = link;
  });
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
  
  // Start the async loading process
  const doLoad = async () => {
    try {
      log(`Initializing SociableKit (attempt ${scriptAttempts + 1}/${MAX_ATTEMPTS})`);
      
      // First load the stylesheet with cache busting
      const styleUrl = `https://widgets.sociablekit.com/linkedin-recommendations/widget.css?${timestamp}`;
      await loadStyle(styleUrl);
      
      // Then load the script with cache busting
      const scriptUrl = `https://widgets.sociablekit.com/linkedin-recommendations/widget.js?${timestamp}`;
      await loadScript(scriptUrl, 15000);  // 15 second timeout
      
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

// Function to check if widget is loaded
export const isWidgetLoaded = (): boolean => {
  // Check for elements that indicate widget is loaded
  const widgetExists = document.querySelectorAll('.sk-ww-linkedin-recommendations-item').length > 0;
  const globalExists = !!window.SK_LINKEDIN_RECOMMENDATIONS;
  
  log(`Widget loaded check: Elements? ${widgetExists ? 'Yes' : 'No'}, Global? ${globalExists ? 'Yes' : 'No'}`);
  
  return widgetExists && globalExists;
};

// Global type definition for SociableKIT
declare global {
  interface Window {
    SK_LINKEDIN_RECOMMENDATIONS?: {
      reload: () => void;
    };
  }
}
