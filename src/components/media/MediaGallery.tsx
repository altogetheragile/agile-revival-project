
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { File, Image, Music, Video, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

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
  // Add state to track refresh keys for each image
  const [refreshKeys, setRefreshKeys] = useState<Record<string, number>>({});
  
  // Function to force refresh a specific image
  const refreshImage = (url: string) => {
    setRefreshKeys(prev => ({
      ...prev,
      [url]: Date.now()
    }));
    
    toast.success("Image refreshed", {
      description: "The image has been refreshed from source."
    });
  };
  
  const renderMediaItem = (item: { name: string; url: string; type: string }) => {
    // Add cache busting to the URL
    const refreshKey = refreshKeys[item.url] || 0;
    const cachedUrl = refreshKey ? `${item.url.split('?')[0]}?v=${refreshKey}` : item.url;
    
    switch (item.type) {
      case 'image':
        return (
          <div className="relative w-full h-full">
            <img 
              src={cachedUrl} 
              alt={item.name}
              className="w-full aspect-square object-cover rounded-md"
              key={refreshKey || 'initial'}
              onError={(e) => {
                console.error(`Failed to load image: ${cachedUrl}`);
                console.error(`Browser: ${navigator.userAgent}`);
                
                // Set a fallback image
                (e.target as HTMLImageElement).src = '/placeholder.svg';
                
                // Add visual indicator for failed images
                const parent = (e.target as HTMLElement).parentElement;
                if (parent && !parent.querySelector('.error-indicator')) {
                  const errorIndicator = document.createElement('div');
                  errorIndicator.className = 'absolute top-0 right-0 p-1 bg-red-100 rounded-bl error-indicator';
                  
                  // Add refresh button
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
            {/* Add a refresh button overlay */}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
          {filteredItems.map((item) => (
            <div
              key={`${item.url}-${refreshKeys[item.url] || 'initial'}`}
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
      )}
    </div>
  );
};

export { MediaGallery };
