
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Music, Video, File } from "lucide-react";

interface MediaLibraryTabsProps {
  items: { type: string }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MediaLibraryTabs: React.FC<MediaLibraryTabsProps> = ({
  items, activeTab, setActiveTab
}) => {
  const counts = React.useMemo(() => {
    const counts = { image: 0, audio: 0, video: 0 };
    items.forEach(item => {
      if (item.type in counts) {
        counts[item.type as keyof typeof counts]++;
      }
    });
    return counts;
  }, [items]);

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-2">
        <TabsTrigger value="all" className="flex gap-1">
          <File className="h-4 w-4" /> All ({items.length})
        </TabsTrigger>
        <TabsTrigger value="image" className="flex gap-1">
          <Image className="h-4 w-4" /> Images ({counts.image})
        </TabsTrigger>
        <TabsTrigger value="audio" className="flex gap-1">
          <Music className="h-4 w-4" /> Audio ({counts.audio})
        </TabsTrigger>
        <TabsTrigger value="video" className="flex gap-1">
          <Video className="h-4 w-4" /> Video ({counts.video})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

