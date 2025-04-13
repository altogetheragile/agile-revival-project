
/**
 * Utility to load and initialize Workshop Butler widget
 */

// Create a flag to track if initialization has been attempted
let initAttempted = false;
let scriptLoaded = false;

export const initWorkshopButler = () => {
  return new Promise<(() => void) | undefined>((resolve, reject) => {
    // If we already tried to initialize, check if successful
    if (initAttempted) {
      if (window.WorkshopButlerWidget) {
        console.log("Workshop Butler already initialized, reusing instance");
        resolve(() => {
          // No-op cleanup for already initialized widget
        });
      } else if (scriptLoaded) {
        console.error("Script loaded but widget not available");
        reject(new Error("Workshop Butler widget not available after script load"));
      } else {
        console.error("Previous initialization attempt failed");
        reject(new Error("Workshop Butler initialization previously failed"));
      }
      return;
    }
    
    // Mark that initialization has been attempted
    initAttempted = true;
    
    // Check if the script already exists to avoid duplicates
    const existingScript = document.querySelector('script[src*="workshopbutler"]');
    if (existingScript) {
      console.log("Workshop Butler script already exists, reusing");
      
      // If script exists, try to initialize
      if (window.WorkshopButlerWidget) {
        console.log("Workshop Butler widget found, initializing from utility");
        try {
          window.WorkshopButlerWidget.init();
          scriptLoaded = true;
          resolve(undefined);
        } catch (error) {
          console.error("Failed to initialize existing Workshop Butler:", error);
          reject(error);
        }
      } else {
        console.error("Workshop Butler script exists but widget not available");
        reject(new Error("Workshop Butler widget not available"));
      }
      
      return;
    }
    
    // Initialize the Workshop Butler script
    const script = document.createElement('script');
    script.src = "https://workshopbutler.com/js/widget.js";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log("Workshop Butler script loaded successfully");
      scriptLoaded = true;
      
      // Add a small delay to ensure the widget object is properly initialized
      setTimeout(() => {
        // Check if the widget object is available after script load
        if (window.WorkshopButlerWidget) {
          console.log("Workshop Butler widget found, initializing from utility");
          try {
            window.WorkshopButlerWidget.init();
            resolve(() => {
              // Clean up function
              if (document.body.contains(script)) {
                document.body.removeChild(script);
                scriptLoaded = false;
                initAttempted = false;
              }
            });
          } catch (error) {
            console.error("Error initializing Workshop Butler:", error);
            reject(error);
          }
        } else {
          console.error("Workshop Butler widget not available after script load");
          reject(new Error("Workshop Butler widget not available after script load"));
        }
      }, 500); // Short delay to ensure widget is registered
    };
    
    script.onerror = (error) => {
      console.error("Failed to load Workshop Butler script:", error);
      reject(new Error("Failed to load Workshop Butler script"));
    };
    
    document.body.appendChild(script);
  });
};
