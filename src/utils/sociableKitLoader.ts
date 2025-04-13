
/**
 * Utility to load and initialize SociableKIT widgets
 */

// Track if the script has already been loaded
let sociableKitLoaded = false;

export const initSociableKit = () => {
  // If already loaded, don't add another script
  if (sociableKitLoaded) {
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
    return () => {};
  }
  
  console.log("Loading SociableKIT script for LinkedIn recommendations");
  
  // Initialize the SociableKIT script for LinkedIn recommendations
  const script = document.createElement('script');
  script.src = "https://widgets.sociablekit.com/linkedin-recommendations/widget.js";
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
  
  // Mark as loaded
  sociableKitLoaded = true;
  
  script.onload = () => {
    console.log("SociableKIT script loaded successfully");
  };
  
  script.onerror = (err) => {
    console.error("Error loading SociableKIT script:", err);
    sociableKitLoaded = false; // Reset flag to allow retry
  };

  return () => {
    // Clean up function
    if (document.body.contains(script)) {
      document.body.removeChild(script);
      sociableKitLoaded = false;
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
