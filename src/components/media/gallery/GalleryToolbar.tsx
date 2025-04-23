
import React from 'react';
import { Button } from "@/components/ui/button";
import { Smartphone, Star, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { synchronizeImageUrls, makeThisBrowserMasterSource } from "@/utils/courseStorage";

interface GalleryToolbarProps {
  refreshAllImages: () => void;
  isMasterSource: boolean;
  browserId: string;
}

const GalleryToolbar: React.FC<GalleryToolbarProps> = ({
  refreshAllImages,
  isMasterSource,
  browserId,
}) => {
  // Function to sync images across devices
  const handleSyncAcrossDevices = () => {
    toast.success("Synchronizing images", {
      description: "Making all your devices show the same images. Page will refresh."
    });
    
    setTimeout(() => {
      synchronizeImageUrls();
    }, 1000);
  };
  
  // Function to make this browser the master source for images
  const handleMakeMasterSource = () => {
    toast.success("Setting Master Source", {
      description: "This browser is now the authoritative source for images. All other devices will sync to match."
    });
    
    setTimeout(() => {
      makeThisBrowserMasterSource();
    }, 1000);
  };

  return (
    <div className="flex gap-2 mb-2">
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
        onClick={refreshAllImages}
        className="text-xs"
      >
        <RefreshCcw className="h-3 w-3 mr-1" />
        Refresh All
      </Button>
    </div>
  );
};

export default GalleryToolbar;
