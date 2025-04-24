
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "sonner";

interface CourseImagePreviewProps {
  imageUrl: string;
  aspectRatio: string;
  imageSize: number;
  refreshKey: string;
  handleRefreshImage: () => void;
}

export const CourseImagePreview: React.FC<CourseImagePreviewProps> = ({
  imageUrl,
  aspectRatio,
  imageSize,
  refreshKey,
  handleRefreshImage
}) => {
  // Parse the aspect ratio string into a number
  const getAspectRatioValue = (ratio: string): number => {
    if (ratio === "auto") return undefined as any; // Let the image use its natural ratio
    const [width, height] = ratio.split("/").map(Number);
    return width / height;
  };

  const imageStyle = {
    width: `${imageSize}%`,
    maxWidth: '100%',
  };
  
  // Use the imageUrl directly, with an additional key to force refresh when needed
  const displayUrl = `${imageUrl}${refreshKey ? `&_k=${refreshKey}` : ''}`;

  // Render image
  return (
    <div className="w-full" style={imageStyle}>
      {aspectRatio === "auto" ? (
        <img 
          src={displayUrl}
          alt="Preview"
          className="w-full object-contain"
          key={refreshKey}
          onError={(e) => {
            console.error("Failed to load image:", imageUrl);
            // Set a fallback or display an error indicator
            (e.target as HTMLImageElement).src = "/placeholder.svg";
            
            // Show a toast to suggest refreshing
            toast.error("Failed to load image", {
              description: "Try clicking the 'Refresh Image' button to reload it.",
              action: {
                label: "Refresh",
                onClick: handleRefreshImage
              }
            });
          }}
        />
      ) : (
        <AspectRatio ratio={getAspectRatioValue(aspectRatio)}>
          <img
            src={displayUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            key={refreshKey}
            onError={(e) => {
              console.error("Failed to load image:", imageUrl);
              // Set a fallback or display an error indicator
              (e.target as HTMLImageElement).src = "/placeholder.svg";
              
              // Show a toast to suggest refreshing
              toast.error("Failed to load image", {
                description: "Try clicking the 'Refresh Image' button to reload it.",
                action: {
                  label: "Refresh",
                  onClick: handleRefreshImage
                }
              });
            }}
          />
        </AspectRatio>
      )}
    </div>
  );
};

export default CourseImagePreview;
