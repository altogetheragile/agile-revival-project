import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { File, Image, Music, Video, RefreshCcwDot, RefreshCw } from "lucide-react";
import { useMediaRefresh } from "@/hooks/useMediaRefresh";

const MediaIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'image': return <Image className="h-4 w-4" />;
    case 'audio': return <Music className="h-4 w-4" />;
    case 'video': return <Video className="h-4 w-4" />;
    default: return <File className="h-4 w-4" />;
  }
};

const MediaImage: React.FC<{
  url: string;
  name: string;
  refreshImage: () => void;
  cacheBustKey: string;
}> = ({ url, name, refreshImage, cacheBustKey }) => {
  return (
    <img 
      src={url} 
      alt={name}
      className="w-full aspect-square object-cover rounded-md"
      key={cacheBustKey}
      onError={(e) => {
        console.error(`Failed to load image: ${url}`);
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
            refreshImage();
          };
          
          errorIndicator.appendChild(refreshButton);
          parent.appendChild(errorIndicator);
        }
      }}
    />
  );
};

const MediaItem: React.FC<{
  item: { name: string; url: string; type: string };
  onSelect: () => void;
  isSelected: boolean;
  onRefresh: () => void;
  cacheBustKey: string;
}> = ({ item, onSelect, isSelected, onRefresh, cacheBustKey }) => {
  return (
    <div
      className={`relative group cursor-pointer border rounded-md p-2 hover:bg-gray-50 transition-colors ${
        isSelected ? 'ring-2 ring-agile-purple bg-gray-50' : ''
      }`}
      onClick={onSelect}
    >
      <div className="relative w-full h-full">
        {item.type === 'image' ? (
          <MediaImage 
            url={item.url} 
            name={item.name} 
            refreshImage={onRefresh}
            cacheBustKey={cacheBustKey}
          />
        ) : (
          <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-md">
            <MediaIcon type={item.type} />
          </div>
        )}
        <div className="mt-1 flex items-center gap-1">
          <MediaIcon type={item.type} />
          <span className="text-xs truncate">{item.name}</span>
        </div>
        <button 
          className="absolute top-1 right-1 bg-white bg-opacity-70 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onRefresh();
          }}
        >
          <RefreshCw className="h-3 w-3 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

interface MediaGalleryProps {
  items: { name: string; url: string; type: string }[];
  loading: boolean;
  bucketExists: boolean;
  activeTab: string;
  onSelect: (url: string) => void;
  selectedImage?: string | null;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  items, loading, bucketExists, activeTab, onSelect, selectedImage
}) => {
  const { globalCacheBust, refreshKeys, refreshImage, refreshAllImages } = useMediaRefresh();
  
  const filteredItems = React.useMemo(() => {
    if (activeTab === "all") return items;
    return items.filter(item => item.type === activeTab);
  }, [items, activeTab]);

  const imageCount = filteredItems.filter(item => item.type === 'image').length;

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
            <div className="flex justify-end mb-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refreshAllImages(filteredItems.map(item => item.url))}
                className="text-xs"
              >
                <RefreshCcwDot className="h-3 w-3 mr-1" />
                Refresh All Images ({imageCount})
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
            {filteredItems.map((item) => (
              <MediaItem
                key={`${item.url}-${refreshKeys[item.url] || globalCacheBust}`}
                item={item}
                onSelect={() => onSelect(item.url)}
                isSelected={selectedImage === item.url}
                onRefresh={() => refreshImage(item.url)}
                cacheBustKey={`${refreshKeys[item.url] || globalCacheBust}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
