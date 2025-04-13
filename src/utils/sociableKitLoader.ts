
/**
 * Utility to load and initialize SociableKIT widgets
 */

// Track if the script has already been loaded
let sociableKitLoaded = false;
let sociableKitScript: HTMLScriptElement | null = null;

export const initSociableKit = () => {
  // If already loaded, don't add another script
  if (sociableKitLoaded && sociableKitScript) {
    console.log("SociableKIT script already loaded, refreshing widget");
    
    // Try to reinitialize the widget if it exists
    if (window.SK_LINKEDIN_RECOMMENDATIONS) {
      try {
        window.SK_LINKEDIN_RECOMMENDATIONS.reload();
      } catch (err) {
        console.error("Failed to reload LinkedIn recommendations:", err);
      }
    }
    return () => {};
  }
  
  console.log("Loading SociableKIT script for LinkedIn recommendations");
  
  // Remove any existing script to avoid conflicts
  if (sociableKitScript && document.body.contains(sociableKitScript)) {
    document.body.removeChild(sociableKitScript);
    sociableKitLoaded = false;
  }
  
  // Initialize the SociableKIT script for LinkedIn recommendations
  sociableKitScript = document.createElement('script');
  sociableKitScript.src = "https://widgets.sociablekit.com/linkedin-recommendations/widget.js";
  sociableKitScript.async = true;
  sociableKitScript.defer = true;
  document.body.appendChild(sociableKitScript);
  
  // Mark as loaded
  sociableKitLoaded = true;
  
  sociableKitScript.onload = () => {
    console.log("SociableKIT script loaded successfully");
  };
  
  sociableKitScript.onerror = (err) => {
    console.error("Error loading SociableKIT script:", err);
    sociableKitLoaded = false; // Reset flag to allow retry
    if (sociableKitScript && document.body.contains(sociableKitScript)) {
      document.body.removeChild(sociableKitScript);
    }
    sociableKitScript = null;
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
  // Check for both the container and if the SK_LINKEDIN_RECOMMENDATIONS global is available
  const containerExists = !!document.querySelector('.sk-ww-linkedin-recommendations');
  const globalExists = typeof window !== 'undefined' && !!window.SK_LINKEDIN_RECOMMENDATIONS;
  
  return containerExists && globalExists;
};

// Add a global type definition to prevent TypeScript errors
declare global {
  interface Window {
    SK_LINKEDIN_RECOMMENDATIONS?: {
      reload: () => void;
    };
  }
}
