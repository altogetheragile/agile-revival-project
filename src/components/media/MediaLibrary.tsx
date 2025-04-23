
import React, { useEffect } from 'react';
import MediaLibraryDialog from "./MediaLibraryDialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertTriangle } from "lucide-react";
import { 
  resetCoursesToInitial, 
  verifyStorageIntegrity, 
  setupCourseUpdateListener,
  getStorageVersion
} from "@/utils/courseStorage";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

// Export the reset function so it can be called from other components or console
export const resetMediaLibraryData = resetCoursesToInitial;

// Export the original dialog component as default
export default MediaLibraryDialog;

// Create a helper component for resetting data
export const MediaLibraryReset: React.FC = () => {
  const { toast } = useToast();
  
  const handleReset = () => {
    console.log("Resetting course data with cache busting...");
    
    // First notify user
    toast({
      title: "Media data reset",
      description: "Course image data has been reset to defaults. Page will refresh automatically.",
    });
    
    // Wait a moment for the toast to display before reload
    setTimeout(() => {
      resetCoursesToInitial(true); // This will reload the page with cache busting
    }, 500);
  };
  
  const handleForceRefresh = () => {
    console.log("Forcing browser cache refresh...");
    toast({
      title: "Refreshing browser cache",
      description: "Page will reload to clear image cache.",
    });
    
    setTimeout(() => {
      // Force a hard reload to clear all caches
      window.location.href = window.location.href + '?forceCacheBust=' + Date.now();
    }, 500);
  };
  
  // Always show the reset section for better troubleshooting
  const storageHasIssues = !verifyStorageIntegrity();
  const storageVersion = getStorageVersion();
  
  return (
    <div className="p-4 border border-amber-200 bg-amber-50 rounded-md mb-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-amber-800 font-medium flex items-center gap-2">
              {storageHasIssues && <AlertTriangle className="h-4 w-4 text-amber-600" />}
              Browser storage management
            </h3>
            <p className="text-amber-700 text-sm">
              {storageHasIssues 
                ? "Storage inconsistency detected. Reset recommended."
                : "Reset course images if you're seeing inconsistent images across browsers."}
            </p>
            <p className="text-amber-600 text-xs mt-1">
              Current storage version: {storageVersion || 'Not set'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleReset}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset Course Data
            </Button>
            <Button 
              onClick={handleForceRefresh}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Force Browser Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create a component that exposes the reset function globally and listens for course data changes
export const GlobalResetProvider: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Expose the reset function globally
      // @ts-ignore - Intentionally adding to window for debugging
      window.resetCoursesToInitial = resetCoursesToInitial;
      console.log("Reset function available. Use resetCoursesToInitial() in console to reset course data.");
      
      // Check for URL parameters that indicate cache busting
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('refresh') || urlParams.has('forceCacheBust')) {
        // Show toast notification after page reload
        toast.success("Page refreshed. Image cache should be updated.", {
          description: "If you still see outdated images, try the Force Browser Refresh button.",
          duration: 5000,
        });
        
        // Clean up URL by removing the refresh parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
      
      // Listen for storage changes from other tabs/windows
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'agile-trainer-courses') {
          console.log("Course data changed in another tab/window. Reloading...");
          window.location.reload();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
    
    return () => {};
  }, []);
  
  return null;
};
