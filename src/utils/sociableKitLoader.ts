
/**
 * Utility to load and initialize SociableKIT widgets
 */
export const initSociableKit = () => {
  // Check if the script already exists to avoid duplicates
  const existingScript = document.querySelector('script[src*="sociablekit.com/linkedin-recommendations"]');
  if (existingScript) return;
  
  // Initialize the SociableKIT script for LinkedIn recommendations
  const script = document.createElement('script');
  script.src = "https://widgets.sociablekit.com/linkedin-recommendations/widget.js";
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);

  return () => {
    // Clean up function
    if (document.body.contains(script)) {
      document.body.removeChild(script);
    }
  };
};

// Function to check if LinkedIn recommendations are loaded
export const isLinkedInRecommendationsReady = () => {
  return !!document.querySelector('.sk-ww-linkedin-recommendations');
};
