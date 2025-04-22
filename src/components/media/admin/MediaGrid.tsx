
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, Image, Music, Video } from "lucide-react";
import { MediaPreview } from "./MediaPreview";

interface MediaItem {
  type: string;
  url: string;
  name: string;
}

interface MediaGridProps {
  items: MediaItem[];
  loading: boolean;
  bucketExists: boolean;
  onCopyUrl: (url: string) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  loading,
  bucketExists,
  onCopyUrl
}) => {
  const [activeTab, setActiveTab] = React.useState("all");

  // Filter items based on active tab
  const filteredItems = React.useMemo(() => {
    if (activeTab === "all") return items;
    return items.filter(item => item.type === activeTab);
  }, [items, activeTab]);
  
  // Count items by type
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
    <div>
      <h2 className="font-semibold mb-2">Media Library</h2>
      
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
        
        <TabsContent value={activeTab} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-80 overflow-auto p-2 border rounded bg-white">
          {loading && <div className="col-span-full text-center py-8">Loading media files...</div>}
          {!loading && !bucketExists && (
            <div className="col-span-full text-center text-muted-foreground py-8">
              Media storage is not configured. Create a "media" bucket in your Supabase project and make sure it's set to public.
            </div>
          )}
          {!loading && bucketExists && filteredItems.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">
              No {activeTab !== "all" ? activeTab : ""} files found. Upload some to get started.
            </div>
          )}
          {filteredItems.map((item) => (
            <MediaPreview key={item.url} item={item} onCopyUrl={onCopyUrl} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
