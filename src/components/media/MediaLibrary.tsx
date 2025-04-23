
import React from 'react';
import MediaLibraryDialog from "./MediaLibraryDialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { resetCoursesToInitial, verifyStorageIntegrity } from "@/utils/courseStorage";
import { useToast } from "@/hooks/use-toast";

// Export the reset function so it can be called from other components or console
export const resetMediaLibraryData = resetCoursesToInitial;

// Export the original dialog component as default
export default MediaLibraryDialog;

// Create a helper component for resetting data
export const MediaLibraryReset: React.FC = () => {
  const { toast } = useToast();
  
  const handleReset = () => {
    resetCoursesToInitial();
    toast({
      title: "Media data reset",
      description: "Course image data has been reset to defaults. Please refresh the page.",
    });
    
    // Force a page reload to ensure all data is refreshed
    setTimeout(() => window.location.reload(), 1500);
  };
  
  const storageHasIssues = !verifyStorageIntegrity();
  
  // Only show the reset button if storage integrity check fails
  if (!storageHasIssues) return null;
  
  return (
    <div className="p-4 border border-amber-200 bg-amber-50 rounded-md mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-amber-800 font-medium">Storage inconsistency detected</h3>
          <p className="text-amber-700 text-sm">There may be issues with course images across browsers.</p>
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
