import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZoomIn, ZoomOut, LayoutGrid } from "lucide-react";

interface ImageAdjustmentPanelProps {
  imageUrl: string;
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  onSizeChange: (size: number) => void;
  onLayoutChange: (layout: string) => void;
  size?: number;
  layout?: string;
}

// Layout options define how the image and content are arranged
export type ImageLayout = "standard" | "side-by-side" | "image-top" | "image-left" | "full-width";

const ImageAdjustmentPanel: React.FC<ImageAdjustmentPanelProps> = ({
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

  // Parse the aspect ratio string into a number
  const getAspectRatioValue = (ratio: string): number => {
    if (!ratio || ratio === "auto") return undefined as any; // Let the image use its natural ratio
    const [width, height] = ratio.split("/").map(Number);
    return width / height;
  };

  // Apply changes when user confirms
  const applyChanges = () => {
    console.log("Applying changes:", { currentAspectRatio, currentSize, currentLayout });
    onAspectRatioChange(currentAspectRatio);
    onSizeChange(currentSize);
    onLayoutChange(currentLayout);
  };

  // Handle size slider change
  const handleSizeChange = (value: number[]) => {
    if (!value || !Array.isArray(value)) {
      console.error("Invalid size value:", value);
      return;
    }
    
    const newSize = value[0];
    console.log("Size changing to:", newSize);
    setCurrentSize(newSize);
    // Immediately update parent to ensure changes are captured
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
    // Immediately update parent to ensure changes are captured
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
    // Immediately update parent to ensure changes are captured
    onLayoutChange(value);
  };

  // Apply changes whenever they change (no need for Apply button)
  useEffect(() => {
    console.log("Image adjustment settings changed:", {
      currentAspectRatio,
      currentSize,
      currentLayout
    });
  }, [currentSize, currentAspectRatio, currentLayout]);

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <Tabs defaultValue="layout" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="aspect">Aspect Ratio</TabsTrigger>
            <TabsTrigger value="size">Size</TabsTrigger>
          </TabsList>
          
          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-2">
              <Label>Select Layout</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Button 
                  variant={currentLayout === "standard" ? "default" : "outline"} 
                  className="h-20 flex flex-col items-center justify-center gap-1"
                  onClick={() => handleLayoutChange("standard")}
                >
                  <LayoutGrid size={24} />
                  <span className="text-xs">Standard</span>
                </Button>
                <Button 
                  variant={currentLayout === "side-by-side" ? "default" : "outline"} 
                  className="h-20 flex flex-col items-center justify-center gap-1"
                  onClick={() => handleLayoutChange("side-by-side")}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-6 bg-current rounded-sm mr-1"></div>
                    <div className="w-6 h-6 border-2 border-current rounded-sm"></div>
                  </div>
                  <span className="text-xs">Side by Side</span>
                </Button>
                <Button 
                  variant={currentLayout === "image-top" ? "default" : "outline"} 
                  className="h-20 flex flex-col items-center justify-center gap-1"
                  onClick={() => handleLayoutChange("image-top")}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-3 border-2 border-current rounded-sm mb-1"></div>
                    <div className="w-8 h-5 bg-current rounded-sm"></div>
                  </div>
                  <span className="text-xs">Image Top</span>
                </Button>
                <Button 
                  variant={currentLayout === "image-left" ? "default" : "outline"} 
                  className="h-20 flex flex-col items-center justify-center gap-1"
                  onClick={() => handleLayoutChange("image-left")}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-current rounded-sm mr-1"></div>
                    <div className="w-4 h-6 border-2 border-current rounded-sm"></div>
                  </div>
                  <span className="text-xs">Image Left</span>
                </Button>
                <Button 
                  variant={currentLayout === "full-width" ? "default" : "outline"} 
                  className="h-20 flex flex-col items-center justify-center gap-1"
                  onClick={() => handleLayoutChange("full-width")}
                >
                  <div className="w-12 h-6 bg-current rounded-sm"></div>
                  <span className="text-xs">Full Width</span>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="aspect" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
              <Select 
                value={currentAspectRatio} 
                onValueChange={handleAspectRatioChange}
              >
                <SelectTrigger id="aspect-ratio">
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16/9">16:9 (Widescreen)</SelectItem>
                  <SelectItem value="4/3">4:3 (Standard)</SelectItem>
                  <SelectItem value="1/1">1:1 (Square)</SelectItem>
                  <SelectItem value="3/2">3:2 (Classic Photo)</SelectItem>
                  <SelectItem value="2/3">2:3 (Portrait)</SelectItem>
                  <SelectItem value="9/16">9:16 (Mobile)</SelectItem>
                  <SelectItem value="auto">Auto (Original)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="size" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Image Size: {currentSize}%</Label>
              </div>
              <div className="flex items-center gap-2">
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                <Slider 
                  value={[currentSize]} 
                  min={30} 
                  max={150} 
                  step={5}
                  onValueChange={handleSizeChange} 
                  className="flex-1" 
                />
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Preview</h3>
        <div className="border rounded p-4 bg-white">
          {/* Standard layout */}
          {currentLayout === "standard" && (
            <div className="space-y-4">
              <div style={{ width: `${currentSize}%`, maxWidth: '100%', margin: '0 auto' }}>
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
              <div className="h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                Content Area
              </div>
            </div>
          )}

          {/* Side-by-side layout */}
          {currentLayout === "side-by-side" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div style={{ width: `${currentSize}%`, maxWidth: '100%', margin: '0 auto' }}>
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
              <div className="h-full min-h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                Content Area
              </div>
            </div>
          )}

          {/* Image-top layout */}
          {currentLayout === "image-top" && (
            <div className="space-y-4">
              <div style={{ width: `${currentSize}%`, maxWidth: '100%', margin: '0 auto' }}>
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
              <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                Content Area
              </div>
            </div>
          )}

          {/* Image-left layout */}
          {currentLayout === "image-left" && (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/3" style={{ width: `${currentSize}%`, maxWidth: '100%' }}>
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
              <div className="md:w-2/3 h-full min-h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                Content Area
              </div>
            </div>
          )}

          {/* Full-width layout */}
          {currentLayout === "full-width" && (
            <div className="space-y-4">
              <div style={{ width: `${currentSize}%`, maxWidth: '100%' }}>
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
              <div className="h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                Content Area
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keep this button to maintain backwards compatibility but it now applies changes instantly too */}
      <div className="flex justify-end">
        <Button onClick={applyChanges}>Apply Changes</Button>
      </div>
    </div>
  );
};

export default ImageAdjustmentPanel;
