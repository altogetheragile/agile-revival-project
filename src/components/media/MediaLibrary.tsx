
import React, { useEffect } from 'react';
import MediaLibraryDialog from "./MediaLibraryDialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { resetCoursesToInitial, verifyStorageIntegrity, setupCourseUpdateListener } from "@/utils/courseStorage";
import { useToast } from "@/hooks/use-toast";

// Export the reset function so it can be called from other components or console
export const resetMediaLibraryData = resetCoursesToInitial;

// Export the original dialog component as default
export default MediaLibraryDialog;

// Create a helper component for resetting data
export const MediaLibraryReset: React.FC = () => {
  const { toast } = useToast();
  
  const handleReset = () => {
    console.log("Resetting course data...");
    resetCoursesToInitial(true); // This will reload the page
    toast({
      title: "Media data reset",
      description: "Course image data has been reset to defaults. Page will refresh automatically.",
    });
  };
  
  // Always show the reset button since we're having cross-browser issues
  const storageHasIssues = !verifyStorageIntegrity();
  
  return (
    <div className="p-4 border border-amber-200 bg-amber-50 rounded-md mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-amber-800 font-medium">Browser storage management</h3>
          <p className="text-amber-700 text-sm">
            {storageHasIssues 
              ? "Storage inconsistency detected. Reset recommended."
              : "Reset course images if you're seeing inconsistent images across browsers."}
          </p>
        </div>
        <Button 
          onClick={handleReset}
          variant="outline"
          className="border-amber-300 text-amber-700 hover:bg-amber-100"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reset Course Data
        </Button>
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
      
      // Set up storage event listener to detect changes from other tabs/windows
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
