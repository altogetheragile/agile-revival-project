
/**
 * Utility to load and initialize SociableKIT widgets
 */

// Track if the script has already been loaded
let sociableKitLoaded = false;
let sociableKitScript: HTMLScriptElement | null = null;
let retryAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;

export const initSociableKit = () => {
  // If already loaded, don't add another script
  if (sociableKitLoaded && sociableKitScript) {
    console.log("SociableKIT script already loaded, refreshing widget");
    
    // Try to reinitialize the widget if it exists
    if (window.SK_LINKEDIN_RECOMMENDATIONS) {
      try {
        window.SK_LINKEDIN_RECOMMENDATIONS.reload();
        return () => {};
      } catch (err) {
        console.error("Failed to reload LinkedIn recommendations:", err);
      }
    }
  }
  
  // Clear any previous attempt
  if (sociableKitScript && document.body.contains(sociableKitScript)) {
    document.body.removeChild(sociableKitScript);
    sociableKitLoaded = false;
  }
  
  console.log("Loading SociableKIT script for LinkedIn recommendations");
  
  // Initialize the SociableKIT script for LinkedIn recommendations with a valid embed ID
  sociableKitScript = document.createElement('script');
  sociableKitScript.src = "https://widgets.sociablekit.com/linkedin-recommendations/widget.js";
  sociableKitScript.async = true;
  sociableKitScript.defer = true;
  
  // Use a valid embed ID - this is critical
  sociableKitScript.setAttribute('data-embed-id', '166933');
  document.body.appendChild(sociableKitScript);
  
  // Mark as loaded
  sociableKitLoaded = true;
  
  sociableKitScript.onload = () => {
    console.log("SociableKIT script loaded successfully");
    retryAttempts = 0; // Reset retry attempts on successful load
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

  // Return a synchronous cleanup function
  return () => {
    // Clean up function
    if (sociableKitScript && document.body.contains(sociableKitScript)) {
      document.body.removeChild(sociableKitScript);
      sociableKitLoaded = false;
      sociableKitScript = null;
    }
  };
};

// Function to check if LinkedIn recommendations are loaded
export const isLinkedInRecommendationsReady = () => {
  // More reliable detection - check for actual recommendation items
  const recommendationItems = document.querySelectorAll('.sk-ww-linkedin-recommendations-item');
  const containerExists = document.querySelector('.sk-ww-linkedin-recommendations') !== null;
  const globalExists = typeof window !== 'undefined' && !!window.SK_LINKEDIN_RECOMMENDATIONS;
  
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
