
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LayoutGrid } from 'lucide-react';
import { ImageLayout } from './types';

interface LayoutSelectorProps {
  currentLayout: string;
  onLayoutChange: (layout: ImageLayout) => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  currentLayout,
  onLayoutChange,
}) => {
  return (
    <div className="space-y-2">
      <Label>Select Layout</Label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Button 
          variant={currentLayout === "standard" ? "default" : "outline"} 
          className="h-20 flex flex-col items-center justify-center gap-1"
          onClick={() => onLayoutChange("standard")}
        >
          <LayoutGrid size={24} />
          <span className="text-xs">Standard</span>
        </Button>
        <Button 
          variant={currentLayout === "side-by-side" ? "default" : "outline"} 
          className="h-20 flex flex-col items-center justify-center gap-1"
          onClick={() => onLayoutChange("side-by-side")}
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
          onClick={() => onLayoutChange("image-top")}
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
          onClick={() => onLayoutChange("image-left")}
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
          onClick={() => onLayoutChange("full-width")}
        >
          <div className="w-12 h-6 bg-current rounded-sm"></div>
          <span className="text-xs">Full Width</span>
        </Button>
      </div>
    </div>
  );
};

export default LayoutSelector;
