
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface CourseImageInfoProps {
  aspectRatio: string;
  imageSize: number;
  imageLayout: string;
  globalCacheBust: string;
  refreshKey: number;
  onOpenMediaLibrary: () => void;
}

export const CourseImageInfo: React.FC<CourseImageInfoProps> = ({
  aspectRatio,
  imageSize,
  imageLayout,
  globalCacheBust,
  refreshKey,
  onOpenMediaLibrary
}) => {
  return (
    <div className="p-3 bg-gray-50 border-t flex justify-between items-center text-sm text-gray-500">
      <div>
        {aspectRatio !== "auto" 
          ? `${aspectRatio.replace("/", ":")} ratio` 
          : "Original ratio"} 
        {imageSize !== 100 && ` • ${imageSize}% size`}
        {imageLayout !== "standard" && ` • ${imageLayout} layout`}
        <div className="text-xs text-gray-400">
          Cache: {globalCacheBust.substring(0, 6)}...
          {refreshKey !== parseInt(globalCacheBust) && 
            ` | Local: ${String(refreshKey).substring(0, 6)}...`}
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="flex items-center gap-1"
        onClick={onOpenMediaLibrary}
      >
        <Settings className="h-4 w-4" /> Adjust
      </Button>
    </div>
  );
};

export default CourseImageInfo;
