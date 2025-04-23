
import React from "react";
import { Button } from "@/components/ui/button";
import { File, Image, Music, Video, AlertTriangle } from "lucide-react";

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

const renderMediaItem = (item: { name: string; url: string; type: string }) => {
  switch (item.type) {
    case 'image':
      return (
        <div className="relative w-full h-full">
          <img 
            src={item.url} 
            alt={item.name}
            className="w-full aspect-square object-cover rounded-md"
            onError={(e) => {
              console.error(`Failed to load image: ${item.url}`);
              (e.target as HTMLImageElement).src = '/placeholder.svg';
              
              // Add visual indicator for failed images
              const parent = (e.target as HTMLElement).parentElement;
              if (parent) {
                const errorIndicator = document.createElement('div');
                errorIndicator.className = 'absolute top-0 right-0 p-1 bg-red-100 rounded-bl';
                errorIndicator.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
                parent.appendChild(errorIndicator);
              }
            }}
          />
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

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  items, loading, bucketExists, activeTab, onSelect, selectedImage
}) => {
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
              key={item.url}
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
