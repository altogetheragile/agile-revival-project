
import React, { useState } from "react";
import MediaLibraryDialog from "./MediaLibraryDialog";
import { toast } from "sonner";
import { MediaResetProvider } from "./context/MediaResetContext";

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (
    url: string,
    aspectRatio?: string,
    size?: number,
    layout?: string
  ) => void;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ 
  open, 
  onOpenChange,
  onSelect 
}) => {
  // Track when an image was successfully selected
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  // Handle image selection with improved logging
  const handleSelect = (
    url: string, 
    aspectRatio?: string, 
    size?: number, 
    layout?: string
  ) => {
    console.log("MediaLibrary: Image selected", { url, aspectRatio, size, layout });
    setSelectedUrl(url);
    
    // Call the parent's onSelect handler
    onSelect(url, aspectRatio, size, layout);
    
    // Close the dialog
    onOpenChange(false);
    
    // Show a toast notification
    toast.success("Image selected", {
      description: "The image has been applied to your course."
    });
  };

  return (
    <MediaResetProvider>
      <MediaLibraryDialog
        open={open}
        onOpenChange={onOpenChange}
        onSelect={handleSelect}
      />
    </MediaResetProvider>
  );
};

export default MediaLibrary;

// Export the GlobalResetProvider to fix the import issue
export { GlobalResetProvider } from './context/MediaResetContext';
