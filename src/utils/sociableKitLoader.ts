
/**
 * Utility to load and initialize SociableKIT widgets
 * Note: Now only initializes non-testimonial widgets
 */
export const initSociableKit = () => {
  // Check if the script already exists to avoid duplicates
  const existingScript = document.querySelector('script[src*="sociablekit.com"]');
  if (existingScript) return;
  
  // Initialize the SociableKIT script for other widgets
  // (This could be modified to load specific widgets as needed)
  const script = document.createElement('script');
  script.src = "https://widgets.sociablekit.com/linkedin-profile-posts/widget.js";
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
