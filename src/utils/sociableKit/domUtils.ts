
import { log, EMBED_ID } from './utils';

// Store instances of loaded scripts and styles
let currentScript: HTMLScriptElement | null = null;
let currentStyle: HTMLLinkElement | null = null;

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
export const loadScript = (url: string, timeout = 10000): Promise<void> => {
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
      reject(new Error('Style failed to load'));
    };
    
    // Add to document
    document.head.appendChild(link);
    currentStyle = link;
  });
};

// Check if widget has been loaded
export const isWidgetLoaded = (): boolean => {
  // Check for elements that indicate widget is loaded
  const widgetExists = document.querySelectorAll('.sk-ww-linkedin-recommendations-item').length > 0;
  const globalExists = !!window.SK_LINKEDIN_RECOMMENDATIONS;
  
  log(`Widget loaded check: Elements? ${widgetExists ? 'Yes' : 'No'}, Global? ${globalExists ? 'Yes' : 'No'}`);
  
  return widgetExists && globalExists;
};
