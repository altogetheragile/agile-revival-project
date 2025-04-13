
/**
 * Utility to load and initialize Workshop Butler widget
 */

// Track the initialization state
let isInitialized = false;
let isLoading = false;
let scriptElement: HTMLScriptElement | null = null;

export const initWorkshopButler = () => {
  return new Promise<(() => void) | undefined>((resolve, reject) => {
    // If already initialized, resolve immediately
    if (isInitialized && window.WorkshopButlerWidget) {
      console.log("Workshop Butler already initialized, reusing instance");
      resolve(undefined);
      return;
    }

    // If currently loading, wait for that process
    if (isLoading) {
      console.log("Workshop Butler is already loading, waiting...");
      const checkInterval = setInterval(() => {
        if (isInitialized && window.WorkshopButlerWidget) {
          clearInterval(checkInterval);
          console.log("Workshop Butler finished loading while waiting");
          resolve(undefined);
        }
      }, 500);
      
      // Set a timeout to prevent indefinite waiting
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!isInitialized) {
          console.error("Workshop Butler loading timed out");
          reject(new Error("Loading timed out"));
        }
      }, 10000);
      
      return;
    }
    
    // Start loading the script
    isLoading = true;
    
    // Remove any existing script to avoid conflicts
    const existingScript = document.querySelector('script[src*="workshopbutler"]');
    if (existingScript) {
      existingScript.remove();
      console.log("Removed existing Workshop Butler script");
    }
    
    // Create and append the new script
    scriptElement = document.createElement('script');
    scriptElement.src = "https://workshopbutler.com/js/widget.js";
    scriptElement.async = true;
    scriptElement.defer = true;
    
    // Handle successful script loading
    scriptElement.onload = () => {
      console.log("Workshop Butler script loaded successfully");
      
      // Add a delay to ensure the widget object is properly initialized
      setTimeout(() => {
        if (window.WorkshopButlerWidget) {
          try {
            window.WorkshopButlerWidget.init();
            console.log("Workshop Butler widget initialized successfully");
            isInitialized = true;
            isLoading = false;
            resolve(() => {
              // Cleanup function
              isInitialized = false;
              isLoading = false;
              if (scriptElement && document.body.contains(scriptElement)) {
                document.body.removeChild(scriptElement);
                scriptElement = null;
              }
            });
          } catch (error) {
            console.error("Error initializing Workshop Butler:", error);
            isLoading = false;
            reject(error);
          }
        } else {
          console.error("Workshop Butler widget not available after script load");
          isLoading = false;
          reject(new Error("Widget not available after script load"));
        }
      }, 1000); // Longer delay to ensure widget is registered
    };
    
    // Handle script loading errors
    scriptElement.onerror = (error) => {
      console.error("Failed to load Workshop Butler script:", error);
      isLoading = false;
      reject(new Error("Failed to load Workshop Butler script"));
    };
    
    document.body.appendChild(scriptElement);
  });
};

// Function to check if widget is loaded and available
export const isWorkshopButlerAvailable = () => {
  return isInitialized && !!window.WorkshopButlerWidget;
};
