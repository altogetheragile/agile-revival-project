
/**
 * Utility to load and initialize Workshop Butler widget
 */
export const initWorkshopButler = () => {
  // Check if the script already exists to avoid duplicates
  const existingScript = document.querySelector('script[src*="workshopbutler"]');
  if (existingScript) return;
  
  // Initialize the Workshop Butler script
  const script = document.createElement('script');
  script.src = "https://workshopbutler.com/js/widget.js";
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
