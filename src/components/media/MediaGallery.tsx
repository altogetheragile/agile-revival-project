
import React, { useState, useEffect } from "react";
import { Video } from "lucide-react";
import { getGlobalCacheBust } from "@/utils/courseStorage";
import { GalleryToolbar } from "./gallery/GalleryToolbar";
import { MediaItem } from "./gallery/MediaItem";
import { toast } from "sonner";

interface MediaGalleryProps {
  items: { name: string; url: string; type: string }[];
  loading: boolean;
  bucketExists: boolean;
  activeTab: string;
  onSelect: (url: string) => void;
  selectedImage?: string | null;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  items, loading, bucketExists, activeTab, onSelect, selectedImage
}) => {
  const [globalCacheBust, setGlobalCacheBust] = useState<string>(getGlobalCacheBust());
  const [refreshKeys, setRefreshKeys] = useState<Record<string, number>>({});
  const [isMasterSource, setIsMasterSource] = useState<boolean>(
    localStorage.getItem('agile-trainer-master-source') === 'true'
  );
  const [browserId, setBrowserId] = useState<string>(
    localStorage.getItem('agile-trainer-browser-id') || 'Unknown'
  );
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentBust = getGlobalCacheBust();
      const currentMasterStatus = localStorage.getItem('agile-trainer-master-source') === 'true';
      const currentBrowserId = localStorage.getItem('agile-trainer-browser-id');
      
      if (currentBust !== globalCacheBust) {
        setGlobalCacheBust(currentBust);
        console.log("Updated gallery cache bust key:", currentBust);
      }
      
      if (currentMasterStatus !== isMasterSource) {
        setIsMasterSource(currentMasterStatus);
      }
      
      if (currentBrowserId && currentBrowserId !== browserId) {
        setBrowserId(currentBrowserId);
      }
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [globalCacheBust, isMasterSource, browserId]);
  
  const refreshImage = (url: string) => {
    setRefreshKeys(prev => ({
      ...prev,
      [url]: Date.now()
    }));
    
    toast.success("Image refreshed", {
      description: "The image has been refreshed from source."
    });
  };
  
  const refreshAllImages = () => {
    const newKeys: Record<string, number> = {};
    const timestamp = Date.now();
    
    items.forEach(item => {
      if (item.type === 'image') {
        newKeys[item.url] = timestamp;
      }
    });
    
    setRefreshKeys(newKeys);
    setGlobalCacheBust(getGlobalCacheBust());
    
    toast.success("All images refreshed", {
      description: "All images in the gallery have been refreshed from source."
    });
  };

  const filteredItems = React.useMemo(() => {
    if (activeTab === "all") return items;
    return items.filter(item => item.type === activeTab);
  }, [items, activeTab]);

  const imageCount = filteredItems.filter(item => item.type === 'image').length;

  const isPrivateMode = (() => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return false;
    } catch (e) {
      return true;
    }
  })();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <span className="animate-spin block"><Video className="h-8 w-8" /></span>
        <p className="text-sm text-gray-500">Loading media files...</p>
      </div>
    );
  }

  if (!bucketExists) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Media storage is not configured. Create a "media" bucket in your Supabase project and set it to public.
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No {activeTab !== "all" ? activeTab : ""} files found. Upload one to get started.
      </div>
    );
  }

  return (
    <div className="border rounded-md p-2 h-[50vh] overflow-y-auto bg-white">
      {imageCount > 0 && (
        <GalleryToolbar
          imageCount={imageCount}
          isPrivateMode={isPrivateMode}
          isMasterSource={isMasterSource}
          browserId={browserId}
          globalCacheBust={globalCacheBust}
          onRefreshAll={refreshAllImages}
        />
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
        {filteredItems.map((item) => (
          <MediaItem
            key={item.url}
            item={item}
            refreshKey={refreshKeys[item.url] || 0}
            globalCacheBust={globalCacheBust}
            browserId={browserId}
            selectedImage={selectedImage}
            onSelect={onSelect}
            onRefreshImage={refreshImage}
          />
        ))}
      </div>
    </div>
  );
};

export { MediaGallery };
