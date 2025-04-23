
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut } from 'lucide-react';

interface SizeSliderProps {
  currentSize: number;
  onSizeChange: (size: number[]) => void;
}

const SizeSlider: React.FC<SizeSliderProps> = ({
  currentSize,
  onSizeChange,
}) => {
  return (
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
          onValueChange={onSizeChange} 
          className="flex-1" 
        />
        <ZoomIn className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};

export default SizeSlider;
