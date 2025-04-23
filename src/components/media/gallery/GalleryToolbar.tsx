
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcwDot, RefreshCw, Star, Smartphone } from "lucide-react";
import { synchronizeImageUrls, makeThisBrowserMasterSource } from "@/utils/courseStorage";
import { toast } from "sonner";

interface GalleryToolbarProps {
  imageCount: number;
  isPrivateMode: boolean;
  isMasterSource: boolean;
  browserId: string;
  globalCacheBust: string;
  onRefreshAll: () => void;
}

export const GalleryToolbar: React.FC<GalleryToolbarProps> = ({
  imageCount,
  isPrivateMode,
  isMasterSource,
  browserId,
  globalCacheBust,
  onRefreshAll
}) => {
  const handleSyncAcrossDevices = () => {
    toast.success("Synchronizing images", {
      description: "Making all your devices show the same images. Page will refresh."
    });
    setTimeout(() => synchronizeImageUrls(), 1000);
  };

  const handleMakeMasterSource = () => {
    toast.success("Setting Master Source", {
      description: "This browser is now the authoritative source for images. All other devices will sync to match."
    });
    setTimeout(() => makeThisBrowserMasterSource(), 1000);
  };

  const forceHardRefresh = () => {
    toast.success("Hard refresh", {
      description: "Performing a complete reload with cache clearing."
    });
    setTimeout(() => window.location.reload(true), 1000);
  };

  return (
    <>
      <div className="flex justify-end mb-2 gap-2">
        {isPrivateMode && (
          <div className="bg-purple-50 border border-purple-300 text-purple-800 rounded px-2 py-0.5 text-xs flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Private/Incognito Mode
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleMakeMasterSource}
          className={`text-xs ${isMasterSource ? 'bg-yellow-50 text-yellow-700 border-yellow-300' : 'bg-amber-50 text-amber-700 border-amber-300'}`}
          disabled={isMasterSource}
        >
          <Star className="h-3 w-3 mr-1" />
          {isMasterSource ? 'Current Master Source' : 'Make Master Source'}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSyncAcrossDevices}
          className="text-xs bg-blue-50 text-blue-700 border-blue-300"
        >
          <Smartphone className="h-3 w-3 mr-1" />
          Sync Across Devices
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefreshAll}
          className="text-xs"
        >
          <RefreshCcwDot className="h-3 w-3 mr-1" />
          Refresh All ({imageCount})
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={forceHardRefresh}
          className="text-xs bg-amber-50 text-amber-700 border-amber-300"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Hard Refresh
        </Button>
      </div>
      
      <div className="mb-2 text-xs text-gray-500 bg-gray-50 p-1 rounded border border-gray-200">
        <div className="flex justify-between items-center">
          <div>Browser ID: {browserId.substring(0, 8)}...</div>
          <div>Cache: {globalCacheBust.substring(0, 8)}...</div>
          {isMasterSource && <div className="text-yellow-600 font-semibold flex items-center"><Star className="h-3 w-3 mr-1" /> Master Source</div>}
        </div>
      </div>
    </>
  );
};
