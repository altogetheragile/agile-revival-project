
import React from "react";
import { File, Image, Music, Video } from "lucide-react";

export const getMediaIcon = (type: string) => {
  switch (type) {
    case 'image': return <Image className="h-4 w-4" />;
    case 'audio': return <Music className="h-4 w-4" />;
    case 'video': return <Video className="h-4 w-4" />;
    default: return <File className="h-4 w-4" />;
  }
};
