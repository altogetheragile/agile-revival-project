
/**
 * Utility to load and initialize SociableKIT widgets
 */
export const initSociableKit = () => {
  // Check if the script already exists to avoid duplicates
  const existingScript = document.querySelector('script[src*="sociablekit.com"]');
  if (existingScript) return;
  
  // Initialize the SociableKIT script
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
