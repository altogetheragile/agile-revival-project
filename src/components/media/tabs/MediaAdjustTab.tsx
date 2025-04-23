
import React from 'react';
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

  return (
    <div>
      {selectedImage ? (
        <ImageAdjustmentPanel
          imageUrl={selectedImage}
          aspectRatio={selectedAspectRatio || "16/9"}
          size={selectedSize || 100}
          layout={selectedLayout || "standard"}
          onAspectRatioChange={setSelectedAspectRatio}
          onSizeChange={setSelectedSize}
          onLayoutChange={setSelectedLayout}
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
        <Button 
          onClick={() => {
            console.log("Confirming selection:", selectedImage, selectedAspectRatio, selectedSize, selectedLayout);
            handleConfirmSelection();
            toast("Image selected", {
              description: "The image has been applied successfully"
            });
          }}
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
