
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import ImageAdjustmentPanel from "../ImageAdjustmentPanel";
import { useMediaLibraryContext } from "../context/MediaLibraryContext";
import { toast } from "sonner";

export const MediaAdjustTab: React.FC = () => {
  const {
    selectedImage,
    selectedAspectRatio,
    selectedSize,
    selectedLayout,
    setSelectedAspectRatio,
    setSelectedSize,
    setSelectedLayout,
    setActiveTabPanel,
    handleConfirmSelection
  } = useMediaLibraryContext();

  // Local state to track changes before applying them
  const [aspectRatio, setAspectRatio] = useState(selectedAspectRatio || "16/9");
  const [size, setSize] = useState(selectedSize || 100);
  const [layout, setLayout] = useState(selectedLayout || "standard");
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local state when selected values change
  useEffect(() => {
    setAspectRatio(selectedAspectRatio || "16/9");
    setSize(selectedSize || 100);
    setLayout(selectedLayout || "standard");
    setHasChanges(false);
  }, [selectedAspectRatio, selectedSize, selectedLayout]);

  // Track when local values differ from context values
  useEffect(() => {
    const changed = 
      aspectRatio !== selectedAspectRatio ||
      size !== selectedSize ||
      layout !== selectedLayout;
    
    setHasChanges(changed);
    
    console.log("MediaAdjustTab - Checking for changes:", {
      local: { aspectRatio, size, layout },
      selected: { selectedAspectRatio, selectedSize, selectedLayout },
      hasChanges: changed
    });
  }, [aspectRatio, size, layout, selectedAspectRatio, selectedSize, selectedLayout]);

  // Handle local changes from the adjustment panel
  const handleAspectRatioChange = (value: string) => {
    console.log("Changing aspect ratio to:", value);
    setAspectRatio(value);
  };

  const handleSizeChange = (value: number) => {
    console.log("Changing size to:", value);
    setSize(value);
  };

  const handleLayoutChange = (value: string) => {
    console.log("Changing layout to:", value);
    setLayout(value);
  };

  // Apply changes to the context state
  const applyChanges = () => {
    console.log("Applying changes to context:", { aspectRatio, size, layout });
    setSelectedAspectRatio(aspectRatio);
    setSelectedSize(size);
    setSelectedLayout(layout);
    setHasChanges(false);
    toast.success("Changes applied", {
      description: "Your image adjustments have been applied."
    });
  };

  // Handles the final confirmation with saving
  const confirmSelection = () => {
    // First make sure any unapplied changes are applied
    if (hasChanges) {
      setSelectedAspectRatio(aspectRatio);
      setSelectedSize(size);
      setSelectedLayout(layout);
    }
    
    console.log("Confirming selection with settings:", {
      image: selectedImage,
      aspectRatio: hasChanges ? aspectRatio : selectedAspectRatio,
      size: hasChanges ? size : selectedSize,
      layout: hasChanges ? layout : selectedLayout
    });
    
    handleConfirmSelection();
    toast.success("Image selected", {
      description: "The image and settings have been saved successfully"
    });
  };

  return (
    <div>
      {selectedImage ? (
        <ImageAdjustmentPanel
          imageUrl={selectedImage}
          aspectRatio={aspectRatio}
          size={size}
          layout={layout}
          onAspectRatioChange={handleAspectRatioChange}
          onSizeChange={handleSizeChange}
          onLayoutChange={handleLayoutChange}
        />
      ) : (
        <div className="p-6 text-center">
          <p className="text-gray-500">No image selected. Please select an image first.</p>
        </div>
      )}
      
      <div className="mt-4 flex justify-end space-x-2">
        <Button 
          onClick={() => {
            // Ask if they want to apply changes before going back
            if (hasChanges) {
              if (window.confirm("You have unsaved changes. Apply changes before going back?")) {
                applyChanges();
              }
            }
            console.log("Returning to browse panel");
            setActiveTabPanel("browse");
          }}
          variant="outline"
        >
          Back to Browse
        </Button>
        
        <Button 
          onClick={applyChanges}
          variant="secondary"
          disabled={!selectedImage || !hasChanges}
        >
          Apply Changes
        </Button>
        
        <Button 
          onClick={confirmSelection}
          variant="default"
          disabled={!selectedImage}
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
};

export default MediaAdjustTab;
