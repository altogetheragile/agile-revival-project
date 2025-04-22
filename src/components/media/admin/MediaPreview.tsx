
import React from "react";
import { Image, Music, Video, File, Link2 } from "lucide-react";

interface MediaItem {
  type: string;
  url: string;
  name: string;
}

interface MediaPreviewProps {
  item: MediaItem;
  onCopyUrl: (url: string) => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ item, onCopyUrl }) => {
  // Get icon based on media type
  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  // Render preview based on media type
  const renderMediaPreview = () => {
    switch (item.type) {
      case 'image':
        return (
          <img
            src={item.url}
            alt={item.name}
            className="w-full h-28 object-contain border rounded bg-gray-50"
            title={item.name}
          />
        );
      case 'audio':
        return (
          <div className="w-full h-28 flex flex-col items-center justify-center border rounded bg-gray-50">
            <Music className="h-10 w-10 text-gray-400 mb-1" />
            <audio src={item.url} controls className="w-full h-6 mt-1" />
          </div>
        );
      case 'video':
        return (
          <div className="w-full h-28 flex items-center justify-center border rounded bg-gray-50 relative">
            <Video className="h-10 w-10 text-gray-400" />
          </div>
        );
      default:
        return (
          <div className="w-full h-28 flex items-center justify-center border rounded bg-gray-50">
            <File className="h-10 w-10 text-gray-400" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 group">
      {renderMediaPreview()}
      <div className="flex items-center gap-1 w-full">
        {getMediaIcon(item.type)}
        <span className="text-xs truncate max-w-[80%]" title={item.name}>
          {item.name}
        </span>
      </div>
      <div className="flex gap-1">
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 text-xs underline"
        >
          View
        </a>
        <button
          onClick={() => onCopyUrl(item.url)}
          className="text-blue-600 text-xs underline flex items-center gap-0.5"
        >
          <Link2 className="h-3 w-3" /> Copy URL
        </button>
      </div>
    </div>
  );
};
