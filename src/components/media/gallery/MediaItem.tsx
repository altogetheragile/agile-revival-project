
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMediaIcon } from "./MediaIcon";

interface MediaItemProps {
  item: {
    name: string;
    url: string;
    type: string;
  };
  refreshKey: number;
  globalCacheBust: string;
  browserId: string;
  selectedImage?: string | null;
  onSelect: (url: string) => void;
  onRefreshImage: (url: string) => void;
}

export const MediaItem: React.FC<MediaItemProps> = ({
  item,
  refreshKey,
  globalCacheBust,
  browserId,
  selectedImage,
  onSelect,
  onRefreshImage
}) => {
  const baseUrl = item.url.split('?')[0];
  const cachedUrl = `${baseUrl}?v=${refreshKey || globalCacheBust}-${Date.now().toString().slice(-4)}-${browserId}`;

  const renderMediaContent = () => {
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
                    onRefreshImage(item.url);
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
                onRefreshImage(item.url);
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

  return (
    <div
      key={`${item.url}-${refreshKey || globalCacheBust}-${browserId}`}
      className={`relative group cursor-pointer border rounded-md p-2 hover:bg-gray-50 transition-colors ${
        selectedImage === item.url ? 'ring-2 ring-agile-purple bg-gray-50' : ''
      }`}
      onClick={() => onSelect(item.url)}
    >
      {renderMediaContent()}
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
  );
};
