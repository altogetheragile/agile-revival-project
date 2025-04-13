
/**
 * Utility to load and initialize SociableKIT widgets
 */

// Track if the script has already been loaded
let sociableKitLoaded = false;
let sociableKitScript: HTMLScriptElement | null = null;
let styleElement: HTMLLinkElement | null = null;
let retryAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;

// Function to create a clean container for LinkedIn recommendations
const createRecommendationsContainer = () => {
  // Remove any existing containers first
  const existingContainers = document.querySelectorAll('.sk-ww-linkedin-recommendations');
  existingContainers.forEach(container => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  // Create a fresh container
  const container = document.createElement('div');
  container.className = 'sk-ww-linkedin-recommendations';
  container.setAttribute('data-embed-id', '166933');
  return container;
};

export const initSociableKit = () => {
  console.log("Initializing SociableKit with fresh settings");
  
  // Clean up any previous attempt
  if (sociableKitScript && document.body.contains(sociableKitScript)) {
    document.body.removeChild(sociableKitScript);
    sociableKitLoaded = false;
    sociableKitScript = null;
  }
  
  if (styleElement && document.head.contains(styleElement)) {
    document.head.removeChild(styleElement);
    styleElement = null;
  }
  
  // Reset the global variable to force a fresh load
  if (window.SK_LINKEDIN_RECOMMENDATIONS) {
    try {
      // @ts-ignore
      window.SK_LINKEDIN_RECOMMENDATIONS = undefined;
    } catch (err) {
      console.error("Failed to reset LinkedIn widget globals:", err);
    }
  }
  
  // Create a style element first to improve widget visibility
  styleElement = document.createElement('link');
  styleElement.rel = 'stylesheet';
  styleElement.href = 'https://widgets.sociablekit.com/linkedin-recommendations/widget.css?' + new Date().getTime();
  document.head.appendChild(styleElement);
  
  // Use a direct script URL with cache-busting
  sociableKitScript = document.createElement('script');
  sociableKitScript.src = "https://widgets.sociablekit.com/linkedin-recommendations/widget.js?" + new Date().getTime();
  sociableKitScript.async = true;
  sociableKitScript.defer = true;
  
  // Use a valid embed ID - this is critical
  sociableKitScript.setAttribute('data-embed-id', '166933');
  
  sociableKitScript.onload = () => {
    console.log("SociableKIT script loaded successfully");
    retryAttempts = 0; // Reset retry attempts on successful load
    sociableKitLoaded = true;
  };
  
  sociableKitScript.onerror = (err) => {
    console.error("Error loading SociableKIT script:", err);
    sociableKitLoaded = false;
    
    if (sociableKitScript && document.body.contains(sociableKitScript)) {
      document.body.removeChild(sociableKitScript);
    }
    sociableKitScript = null;
    
    // Auto-retry if under max attempts
    retryAttempts++;
    if (retryAttempts < MAX_RETRY_ATTEMPTS) {
      console.log(`Retrying SociableKIT load (attempt ${retryAttempts}/${MAX_RETRY_ATTEMPTS})...`);
      setTimeout(initSociableKit, 2000); // Retry after 2 seconds
    }
  };
  
  // Append the script to document body
  document.body.appendChild(sociableKitScript);

  // Return a cleanup function
  return () => {
    // Clean up function
    if (sociableKitScript && document.body.contains(sociableKitScript)) {
      document.body.removeChild(sociableKitScript);
      sociableKitLoaded = false;
      sociableKitScript = null;
    }
    
    if (styleElement && document.head.contains(styleElement)) {
      document.head.removeChild(styleElement);
      styleElement = null;
    }
  };
};

// Function to check if LinkedIn recommendations are loaded
export const isLinkedInRecommendationsReady = () => {
  // More reliable detection - check for actual recommendation items using direct DOM query
  const recommendationItems = document.querySelectorAll('.sk-ww-linkedin-recommendations-item');
  const containerExists = document.querySelector('.sk-ww-linkedin-recommendations') !== null;
  const globalExists = typeof window !== 'undefined' && !!window.SK_LINKEDIN_RECOMMENDATIONS;
  
  console.log(`LinkedIn Widget Check - Container: ${containerExists ? 'Yes' : 'No'}, Global: ${globalExists ? 'Yes' : 'No'}, Items: ${recommendationItems.length}`);
  
  return containerExists && globalExists && recommendationItems.length > 0;
};

// Add a global type definition to prevent TypeScript errors
declare global {
  interface Window {
    SK_LINKEDIN_RECOMMENDATIONS?: {
      reload: () => void;
    };
  }
}
