
import { log, EMBED_ID } from './utils';

// Store instances of loaded scripts and styles
let currentScript: HTMLScriptElement | null = null;
let currentStyle: HTMLLinkElement | null = null;
let fallbackStyleElement: HTMLStyleElement | null = null;

// Clean up previous instances of the widget
export const cleanupPrevious = () => {
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
  
  // Remove any fallback styles
  if (fallbackStyleElement && fallbackStyleElement.parentNode) {
    fallbackStyleElement.parentNode.removeChild(fallbackStyleElement);
    fallbackStyleElement = null;
  }
  
  // Remove any existing widget containers
  const containers = document.querySelectorAll('.sk-ww-linkedin-recommendations');
  containers.forEach(container => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  // Remove any other fallback styles
  const fallbackStyles = document.querySelectorAll('style[data-sk-fallback="true"]');
  fallbackStyles.forEach(style => {
    if (style.parentNode) {
      style.parentNode.removeChild(style);
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

// Create fallback CSS for when external stylesheet fails to load
export const addFallbackStyles = () => {
  log('Adding fallback styles');
  
  // Clean up any existing fallback styles first
  if (fallbackStyleElement && fallbackStyleElement.parentNode) {
    fallbackStyleElement.parentNode.removeChild(fallbackStyleElement);
  }
  
  const style = document.createElement('style');
  style.setAttribute('data-sk-fallback', 'true');
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
  fallbackStyleElement = style;
  return style;
};

// Promise-based script loading with retry mechanism
export const loadScript = (url: string, timeout = 10000, retries = 2): Promise<void> => {
  return new Promise((resolve, reject) => {
    const attemptLoad = (attempts: number) => {
      log(`Loading script: ${url} (attempt ${retries - attempts + 1}/${retries + 1})`);
      
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
        log(`Script loading error (attempt ${retries - attempts + 1}/${retries + 1})`, error);
        
        if (attempts > 0) {
          log(`Retrying script load in 1 second...`);
          setTimeout(() => attemptLoad(attempts - 1), 1000);
        } else {
          reject(new Error('Script failed to load after multiple attempts'));
        }
      };
      
      // Set timeout
      const timeoutId = setTimeout(() => {
        log(`Script loading timed out (attempt ${retries - attempts + 1}/${retries + 1})`);
        
        if (attempts > 0) {
          log(`Retrying script load in 1 second...`);
          setTimeout(() => attemptLoad(attempts - 1), 1000);
        } else {
          reject(new Error('Script loading timed out after multiple attempts'));
        }
      }, timeout);
      
      // Clean up any previous script
      if (currentScript && currentScript.parentNode) {
        currentScript.parentNode.removeChild(currentScript);
      }
      
      // Add to document
      document.body.appendChild(script);
      currentScript = script;
      
      // Clean up timeout on success or error
      script.addEventListener('load', () => clearTimeout(timeoutId));
      script.addEventListener('error', () => clearTimeout(timeoutId));
    };
    
    // Start first attempt
    attemptLoad(retries);
  });
};

// Promise-based style loading with fallback
export const loadStyle = (url: string): Promise<void> => {
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
      // Don't reject the promise, instead add fallback styles
      // This way the widget loading can continue even if the style fails
      addFallbackStyles();
      resolve(); // Resolve anyway so we continue loading
    };
    
    // Set timeout to prevent waiting forever
    const timeoutId = setTimeout(() => {
      log('Style loading timed out, using fallback styles');
      addFallbackStyles();
      resolve(); // Resolve anyway so we continue loading
    }, 5000);
    
    // Clean up any previous style
    if (currentStyle && currentStyle.parentNode) {
      currentStyle.parentNode.removeChild(currentStyle);
    }
    
    // Add to document
    document.head.appendChild(link);
    currentStyle = link;
    
    // Clear timeout on success
    link.addEventListener('load', () => clearTimeout(timeoutId));
  });
};

// Check if widget has been loaded - More permissive checking
export const isWidgetLoaded = (): boolean => {
  // Check for various elements and properties that indicate widget is loaded
  const elementExists = document.querySelectorAll('.sk-ww-linkedin-recommendations-item').length > 0;
  const globalExists = !!window.SK_LINKEDIN_RECOMMENDATIONS;
  const hasContent = document.querySelectorAll('.sk-ww-linkedin-recommendations-text').length > 0;
  
  log(`Widget loaded check: Elements? ${elementExists ? 'Yes' : 'No'}, Global? ${globalExists ? 'Yes' : 'No'}, Content? ${hasContent ? 'Yes' : 'No'}`);
  
  // If any of these are true, consider it loaded
  return elementExists || globalExists || hasContent;
};
