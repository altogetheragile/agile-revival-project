
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageAdjustmentProps } from "./image-adjustment/types";
import LayoutSelector from "./image-adjustment/LayoutSelector";
import AspectRatioSelector from "./image-adjustment/AspectRatioSelector";
import SizeSlider from "./image-adjustment/SizeSlider";
import ImagePreview from "./image-adjustment/ImagePreview";

const ImageAdjustmentPanel: React.FC<ImageAdjustmentProps> = ({
  imageUrl,
  aspectRatio = "16/9",
  onAspectRatioChange,
  onSizeChange,
  onLayoutChange,
  size = 100,
  layout = "standard"
}) => {
  const [currentSize, setCurrentSize] = useState<number>(size);
  const [currentLayout, setCurrentLayout] = useState<string>(layout);
  const [currentAspectRatio, setCurrentAspectRatio] = useState<string>(aspectRatio);

  // Initialize with props when they change
  useEffect(() => {
    setCurrentSize(size || 100);
    setCurrentLayout(layout || "standard");
    setCurrentAspectRatio(aspectRatio || "16/9");
    console.log("ImageAdjustmentPanel initialized with:", { 
      aspectRatio: aspectRatio || "16/9", 
      size: size || 100, 
      layout: layout || "standard" 
    });
  }, [aspectRatio, size, layout]);

  // Handle size slider change
  const handleSizeChange = (value: number[]) => {
    if (!value || !Array.isArray(value)) {
      console.error("Invalid size value:", value);
      return;
    }
    
    const newSize = value[0];
    console.log("Size changing to:", newSize);
    setCurrentSize(newSize);
    onSizeChange(newSize);
  };

  // Handle aspect ratio change
  const handleAspectRatioChange = (value: string) => {
    if (!value) {
      console.error("Invalid aspect ratio value:", value);
      return;
    }
    
    console.log("Aspect ratio changing to:", value);
    setCurrentAspectRatio(value);
    onAspectRatioChange(value);
  };

  // Handle layout change
  const handleLayoutChange = (value: string) => {
    if (!value) {
      console.error("Invalid layout value:", value);
      return;
    }
    
    console.log("Layout changing to:", value);
    setCurrentLayout(value);
    onLayoutChange(value);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <Tabs defaultValue="layout" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="aspect">Aspect Ratio</TabsTrigger>
            <TabsTrigger value="size">Size</TabsTrigger>
          </TabsList>
          
          <TabsContent value="layout">
            <LayoutSelector 
              currentLayout={currentLayout}
              onLayoutChange={handleLayoutChange}
            />
          </TabsContent>
          
          <TabsContent value="aspect">
            <AspectRatioSelector
              currentAspectRatio={currentAspectRatio}
              onAspectRatioChange={handleAspectRatioChange}
            />
          </TabsContent>
          
          <TabsContent value="size">
            <SizeSlider
              currentSize={currentSize}
              onSizeChange={handleSizeChange}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <ImagePreview
        imageUrl={imageUrl}
        currentLayout={currentLayout as any}
        currentSize={currentSize}
        currentAspectRatio={currentAspectRatio}
      />
    </div>
  );
};

export default ImageAdjustmentPanel;
