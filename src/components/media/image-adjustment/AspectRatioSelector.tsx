
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AspectRatioSelectorProps {
  currentAspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
  currentAspectRatio,
  onAspectRatioChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
      <Select 
        value={currentAspectRatio} 
        onValueChange={onAspectRatioChange}
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
  );
};

export default AspectRatioSelector;
