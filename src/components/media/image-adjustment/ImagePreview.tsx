
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageLayout } from './types';

interface ImagePreviewProps {
  imageUrl: string;
  currentLayout: ImageLayout;
  currentSize: number;
  currentAspectRatio: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  currentLayout,
  currentSize,
  currentAspectRatio,
}) => {
  const getAspectRatioValue = (ratio: string): number => {
    if (!ratio || ratio === "auto") return undefined as any;
    const [width, height] = ratio.split("/").map(Number);
    return width / height;
  };

  const renderImage = () => {
    const imageStyle = { width: `${currentSize}%`, maxWidth: '100%', margin: '0 auto' };
    
    return (
      <div style={imageStyle}>
        {currentAspectRatio === "auto" ? (
          <img 
            src={imageUrl}
            alt="Preview"
            className="w-full object-contain"
          />
        ) : (
          <AspectRatio ratio={getAspectRatioValue(currentAspectRatio)}>
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        )}
      </div>
    );
  };

  const renderContentArea = () => (
    <div className="h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400">
      Content Area
    </div>
  );

  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-2">Preview</h3>
      <div className="border rounded p-4 bg-white">
        {currentLayout === "standard" && (
          <div className="space-y-4">
            {renderImage()}
            {renderContentArea()}
          </div>
        )}

        {currentLayout === "side-by-side" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderImage()}
            <div className="h-full min-h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              Content Area
            </div>
          </div>
        )}

        {currentLayout === "image-top" && (
          <div className="space-y-4">
            {renderImage()}
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              Content Area
            </div>
          </div>
        )}

        {currentLayout === "image-left" && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3" style={{ width: `${currentSize}%`, maxWidth: '100%' }}>
              {renderImage()}
            </div>
            <div className="md:w-2/3 h-full min-h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              Content Area
            </div>
          </div>
        )}

        {currentLayout === "full-width" && (
          <div className="space-y-4">
            {renderImage()}
            {renderContentArea()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
