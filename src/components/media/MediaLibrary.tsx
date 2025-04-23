
import React, { useEffect } from 'react';
import MediaLibraryDialog from "./MediaLibraryDialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertTriangle, Trash, Smartphone, Star } from "lucide-react";
import { 
  resetCoursesToInitial, 
  verifyStorageIntegrity, 
  setupCourseUpdateListener,
  getStorageVersion,
  getGlobalCacheBust,
  forceGlobalReset,
  synchronizeImageUrls,
  makeThisBrowserMasterSource
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

  const handleNuclearReset = () => {
    console.log("Performing nuclear reset across all browsers...");
    toast({
      title: "Complete system reset",
      description: "Performing a full reset that will affect all browsers. Page will refresh.",
      variant: "destructive",
    });
    
    setTimeout(() => {
      forceGlobalReset();
    }, 1000);
  };

  const handleSynchronizeImages = () => {
    console.log("Synchronizing images across all devices...");
    toast({
      title: "Synchronizing images",
      description: "Making sure all devices show the same images. Page will refresh.",
    });
    
    setTimeout(() => {
      synchronizeImageUrls();
    }, 1000);
  };

  const handleMakeMasterSource = () => {
    console.log("Making this browser the master source for images...");
    toast({
      title: "Setting Master Source",
      description: "This browser is now the authoritative source for images. All other devices will sync to match.",
      variant: "default",
    });
    
    setTimeout(() => {
      makeThisBrowserMasterSource();
    }, 1000);
  };
  
  // Always show the reset section for better troubleshooting
  const storageHasIssues = !verifyStorageIntegrity();
  const storageVersion = getStorageVersion();
  const globalCacheBust = getGlobalCacheBust();
  const isMasterSource = localStorage.getItem('agile-trainer-master-source') === 'true';
  
  return (
    <div className="p-4 border border-amber-200 bg-amber-50 rounded-md mb-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h3 className="text-amber-800 font-medium flex items-center gap-2">
              {storageHasIssues && <AlertTriangle className="h-4 w-4 text-amber-600" />}
              Browser storage management
              {isMasterSource && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                  <Star className="h-3 w-3 mr-1" /> Master Source
                </span>
              )}
            </h3>
            <p className="text-amber-700 text-sm">
              {storageHasIssues 
                ? "Storage inconsistency detected. Reset recommended."
                : "Reset course images if you're seeing inconsistent images across browsers."}
            </p>
            <p className="text-amber-600 text-xs mt-1">
              Storage version: {storageVersion || 'Not set'} | Cache bust: {globalCacheBust || 'Not set'}
              {isMasterSource && ' | This browser is the master source for images'}
            </p>
            <p className="text-amber-600 text-xs mt-1">
              Browser: {navigator.userAgent.substring(0, 50)}...
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <Button 
              onClick={handleMakeMasterSource}
              variant="outline"
              className={`border-yellow-300 ${isMasterSource ? 'bg-yellow-100 text-yellow-700' : 'text-amber-700 hover:bg-amber-100'}`}
              disabled={isMasterSource}
            >
              <Star className="mr-2 h-4 w-4" />
              {isMasterSource ? 'Current Master Source' : 'Make This Browser Master Source'}
            </Button>
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
            <Button 
              onClick={handleSynchronizeImages}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <Smartphone className="mr-2 h-4 w-4" />
              Sync Images Across Devices
            </Button>
            <Button 
              onClick={handleNuclearReset}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <Trash className="mr-2 h-4 w-4" />
              Nuclear Reset (All Browsers)
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
      // @ts-ignore - Expose force global reset function
      window.forceGlobalReset = forceGlobalReset;
      // @ts-ignore - Expose synchronize images function
      window.synchronizeImageUrls = synchronizeImageUrls;
      console.log("Reset functions available. Use resetCoursesToInitial(), forceGlobalReset(), or synchronizeImageUrls() in console to reset course data.");
      
      // Check for URL parameters that indicate cache busting
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('refresh') || urlParams.has('forceCacheBust') || urlParams.has('forcereset') || urlParams.has('sync')) {
        // Show toast notification after page reload
        toast.success("Page refreshed. Image cache should be updated.", {
          description: "If you still see outdated images, try the Nuclear Reset or Sync buttons.",
          duration: 5000,
        });
        
        // Clean up URL by removing the refresh parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
      
      // Listen for storage changes from other tabs/windows
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'agile-trainer-courses' || 
            e.key === 'agile-trainer-storage-version' || 
            e.key === 'agile-trainer-cache-bust' ||
            e.key === 'agile-trainer-last-update') {
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

