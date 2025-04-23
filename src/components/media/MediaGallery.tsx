import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { File, Image, Music, Video, AlertTriangle, RefreshCw, RefreshCcwDot, Star, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { getGlobalCacheBust, synchronizeImageUrls, makeThisBrowserMasterSource } from "@/utils/courseStorage";

interface MediaGalleryProps {
  items: { name: string; url: string; type: string }[];
  loading: boolean;
  bucketExists: boolean;
  activeTab: string;
  onSelect: (url: string) => void;
  selectedImage?: string | null;
}

const getMediaIcon = (type: string) => {
  switch (type) {
    case 'image': return <Image className="h-4 w-4" />;
    case 'audio': return <Music className="h-4 w-4" />;
    case 'video': return <Video className="h-4 w-4" />;
    default: return <File className="h-4 w-4" />;
  }
};

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

  const handleSyncAcrossDevices = () => {
    toast.success("Synchronizing images", {
      description: "Making all your devices show the same images. Page will refresh."
    });
    
    setTimeout(() => {
      synchronizeImageUrls();
    }, 1000);
  };
  
  const handleMakeMasterSource = () => {
    toast.success("Setting Master Source", {
      description: "This browser is now the authoritative source for images. All other devices will sync to match."
    });
    
    setTimeout(() => {
      makeThisBrowserMasterSource();
    }, 1000);
  };

  const forceHardRefresh = () => {
    toast.success("Hard refresh", {
      description: "Performing a complete reload with cache clearing."
    });
    
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  };
  
  const renderMediaItem = (item: { name: string; url: string; type: string }) => {
    const refreshKey = refreshKeys[item.url] || 0;
    const baseUrl = item.url.split('?')[0];
    const cachedUrl = `${baseUrl}?v=${refreshKey || globalCacheBust}-${Date.now().toString().slice(-4)}-${browserId}`;
    
    switch (item.type) {
      case 'image':
        return (
          <div className="relative w-full h-full">
            <img 
              src={cachedUrl} 
              alt={item.name}
              className="w-full aspect-square object-cover rounded-md"
              key={`${refreshKey || 'global'}-${globalCacheBust}-${browserId}`}
              onError={(e) => {
                console.error(`Failed to load image: ${cachedUrl}`);
                console.error(`Browser: ${navigator.userAgent}`);
                console.error(`Browser ID: ${browserId}`);
                
                (e.target as HTMLImageElement).src = '/placeholder.svg';
                
                const parent = (e.target as HTMLElement).parentElement;
                if (parent && !parent.querySelector('.error-indicator')) {
                  const errorIndicator = document.createElement('div');
                  errorIndicator.className = 'absolute top-0 right-0 p-1 bg-red-100 rounded-bl error-indicator';
                  
                  const refreshButton = document.createElement('button');
                  refreshButton.className = 'flex items-center justify-center w-6 h-6 bg-white rounded-full shadow hover:bg-gray-100';
                  refreshButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>';
                  refreshButton.onclick = (evt) => {
                    evt.stopPropagation();
                    refreshImage(item.url);
                  };
                  
                  errorIndicator.appendChild(refreshButton);
                  parent.appendChild(errorIndicator);
                }
              }}
            />
            <button 
              className="absolute top-1 right-1 bg-white bg-opacity-70 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                refreshImage(item.url);
              }}
            >
              <RefreshCw className="h-3 w-3 text-gray-600" />
            </button>
          </div>
        );
      case 'audio':
        return (
          <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-md">
            <Music className="h-12 w-12 text-gray-400" />
            <audio src={item.url} controls className="hidden" />
          </div>
        );
      case 'video':
        return (
          <div className="w-full aspect-square relative bg-gray-100 rounded-md">
            <Video className="absolute inset-0 m-auto h-12 w-12 text-gray-400" />
          </div>
        );
      default:
        return (
          <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-md">
            <File className="h-12 w-12 text-gray-400" />
          </div>
        );
    }
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

  return (
    <div className="border rounded-md p-2 h-[50vh] overflow-y-auto bg-white">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <span className="animate-spin block"><Video className="h-8 w-8" /></span>
          <p className="text-sm text-gray-500">Loading media files...</p>
        </div>
      ) : !bucketExists ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          Media storage is not configured. Create a "media" bucket in your Supabase project and set it to public.
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          No {activeTab !== "all" ? activeTab : ""} files found. Upload one to get started.
        </div>
      ) : (
        <>
          {imageCount > 0 && (
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
                onClick={refreshAllImages}
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
          )}
          
          <div className="mb-2 text-xs text-gray-500 bg-gray-50 p-1 rounded border border-gray-200">
            <div className="flex justify-between items-center">
              <div>Browser ID: {browserId.substring(0, 8)}...</div>
              <div>Cache: {globalCacheBust.substring(0, 8)}...</div>
              {isMasterSource && <div className="text-yellow-600 font-semibold flex items-center"><Star className="h-3 w-3 mr-1" /> Master Source</div>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
            {filteredItems.map((item) => (
              <div
                key={`${item.url}-${refreshKeys[item.url] || globalCacheBust}-${browserId}`}
                className={`relative group cursor-pointer border rounded-md p-2 hover:bg-gray-50 transition-colors ${
                  selectedImage === item.url ? 'ring-2 ring-agile-purple bg-gray-50' : ''
                }`}
                onClick={() => onSelect(item.url)}
              >
                {renderMediaItem(item)}
                <div className="mt-1 flex items-center gap-1">
                  {getMediaIcon(item.type)}
                  <span className="text-xs truncate">{item.name}</span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button variant="secondary" size="sm">
                    {selectedImage === item.url ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export { MediaGallery };
