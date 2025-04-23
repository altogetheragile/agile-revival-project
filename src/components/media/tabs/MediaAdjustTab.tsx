
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

  // Initialize local state when selected values change
  useEffect(() => {
    setAspectRatio(selectedAspectRatio || "16/9");
    setSize(selectedSize || 100);
    setLayout(selectedLayout || "standard");
  }, [selectedAspectRatio, selectedSize, selectedLayout]);

  // Handle local changes from the adjustment panel
  const handleAspectRatioChange = (value: string) => {
    console.log("Changing aspect ratio to:", value);
    setAspectRatio(value);
    // Apply changes immediately to context
    setSelectedAspectRatio(value);
  };

  const handleSizeChange = (value: number) => {
    console.log("Changing size to:", value);
    setSize(value);
    // Apply changes immediately to context
    setSelectedSize(value);
  };

  const handleLayoutChange = (value: string) => {
    console.log("Changing layout to:", value);
    setLayout(value);
    // Apply changes immediately to context
    setSelectedLayout(value);
  };

  // Handles the final confirmation with saving
  const confirmSelection = () => {
    console.log("Confirming selection with settings:", {
      image: selectedImage,
      aspectRatio: aspectRatio,
      size: size,
      layout: layout
    });
    
    // Make sure context is updated with latest settings
    setSelectedAspectRatio(aspectRatio);
    setSelectedSize(size);
    setSelectedLayout(layout);
    
    // Call the handler that will pass these values to the parent
    handleConfirmSelection();
    
    toast.success("Image selected", {
      description: "The image and settings have been successfully applied"
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
            console.log("Returning to browse panel");
            setActiveTabPanel("browse");
          }}
          variant="outline"
        >
          Back to Browse
        </Button>
        
        {/* 
          Since changes are applied automatically in the ImageAdjustmentPanel,
          we don't need this button anymore, but we'll keep it for UI consistency
          with a clear explanation of what it does
        */}
        <Button 
          onClick={() => {
            toast.success("Settings applied", {
              description: "Your image settings have been updated"
            });
          }}
          variant="secondary"
          disabled={!selectedImage}
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
