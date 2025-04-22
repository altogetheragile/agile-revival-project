
import React, { useState, useRef } from "react";
import { useMediaLibrary } from "@/hooks/storage/useMediaLibrary";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Image, Music, Video, File, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminMediaManager: React.FC = () => {
  const { items, loading, upload, fetchMedia, bucketExists, error } = useMediaLibrary();
  const { toast } = useToast();
  const uploadRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        setUploadError(null);
        const { error } = await upload(file);
        
        if (error) {
          console.error("Upload error:", error);
          setUploadError(error.message);
          toast({ 
            title: "Upload failed", 
            description: error.message, 
            variant: "destructive" 
          });
        } else {
          toast({ 
            title: "Upload successful",
            description: "The file was uploaded to the media library."
          });
        }
      } catch (error: any) {
        console.error("Unexpected upload error:", error);
        setUploadError(error.message || "An unexpected error occurred");
        toast({ 
          title: "Upload failed", 
          description: error.message || "An unexpected error occurred", 
          variant: "destructive" 
        });
      } finally {
        setUploading(false);
        if (uploadRef.current) uploadRef.current.value = "";
      }
    }
  };

  const handleRefresh = () => {
    fetchMedia();
    toast({
      title: "Refreshing media library",
      description: "Checking for new media files..."
    });
  };

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
  const renderMediaPreview = (item: { type: string, url: string, name: string }) => {
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
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Storage Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!bucketExists && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Storage Configuration Required</AlertTitle>
          <AlertDescription>
            The media storage bucket has not been created or is not accessible. Please create a "media" bucket in your Supabase project and ensure it's set to public.
          </AlertDescription>
        </Alert>
      )}
      
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-2">
        <input
          id="admin-media-upload"
          type="file"
          accept="image/*, audio/*, video/*"
          hidden
          ref={uploadRef}
          disabled={uploading || !bucketExists}
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => uploadRef.current?.click()}
          disabled={uploading || !bucketExists}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {uploading ? "Uploading..." : "Upload Media"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={loading || uploading}
          className="flex items-center gap-1"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
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
              <div key={item.url} className="flex flex-col items-center gap-1">
                {renderMediaPreview(item)}
                <div className="flex items-center gap-1 w-full">
                  {getMediaIcon(item.type)}
                  <span className="text-xs truncate">{item.name}</span>
                </div>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-agile-purple text-xs underline">
                  View
                </a>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminMediaManager;
