
/**
 * Utility to load and initialize Workshop Butler widget
 */
export const initWorkshopButler = () => {
  return new Promise<(() => void) | undefined>((resolve) => {
    // Check if the script already exists to avoid duplicates
    const existingScript = document.querySelector('script[src*="workshopbutler"]');
    if (existingScript) {
      console.log("Workshop Butler script already exists");
      
      // If script exists, try to initialize anyway
      if (window.WorkshopButlerWidget) {
        try {
          console.log("Reinitializing existing Workshop Butler widget");
          window.WorkshopButlerWidget.init();
        } catch (error) {
          console.error("Failed to reinitialize Workshop Butler:", error);
        }
      }
      
      resolve(undefined);
      return;
    }
    
    // Initialize the Workshop Butler script
    const script = document.createElement('script');
    script.src = "https://workshopbutler.com/js/widget.js";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log("Workshop Butler script loaded successfully");
      
      // Check if the widget object is available after script load
      if (window.WorkshopButlerWidget) {
        console.log("Workshop Butler widget found, initializing from utility");
        try {
          window.WorkshopButlerWidget.init();
        } catch (error) {
          console.error("Error initializing Workshop Butler:", error);
        }
      } else {
        console.error("Workshop Butler widget not available after script load");
      }
      
      resolve(() => {
        // Clean up function
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      });
    };
    
    script.onerror = () => {
      console.error("Failed to load Workshop Butler script");
      resolve(undefined);
    };
    
    document.body.appendChild(script);
  });
};
