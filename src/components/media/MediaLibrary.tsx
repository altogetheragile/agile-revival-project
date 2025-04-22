
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMediaLibrary } from "@/hooks/storage/useMediaLibrary";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Image, Music, Video, File, RefreshCw, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ 
  open, 
  onOpenChange,
  onSelect
}) => {
  const { items, loading, upload, fetchMedia, bucketExists, error } = useMediaLibrary();
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("all");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSelect = (url: string) => {
    console.log("Media selected in MediaLibrary:", url);
    onSelect(url);
    toast({
      title: "Media selected",
      description: "The selected media URL has been added to the form."
    });
    onOpenChange(false);
  };

  const handleRefresh = () => {
    fetchMedia();
    toast({
      title: "Refreshing media library",
      description: "Checking for new media files..."
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const { error } = await upload(file);
        if (error) {
          console.error("Error uploading file:", error);
          toast({
            title: "Upload failed",
            description: error.message || "There was a problem uploading your file",
            variant: "destructive",
          });
        } else {
          toast({
            title: "File uploaded",
            description: "Your file has been uploaded successfully",
          });
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        toast({
          title: "Upload failed",
          description: err.message || "There was a problem uploading your file",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
        // Clear input value to allow uploading the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
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

  // Get media icon based on type
  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  // Render media item based on its type
  const renderMediaItem = (item: { name: string, url: string, type: string }) => {
    switch (item.type) {
      case 'image':
        return (
          <img 
            src={item.url} 
            alt={item.name} 
            className="w-full aspect-square object-cover rounded-md"
          />
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
          <DialogDescription>
            Choose media from the library or upload a new file.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Storage Error</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {!bucketExists && (
          <Card className="border-red-200 bg-red-50 mb-4">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-700">Media Storage Configuration Required</h3>
                  <p className="text-sm text-red-700 mt-1">
                    The media storage bucket has not been created or is not accessible. Please create a "media" bucket 
                    in your Supabase project and ensure it's set to public with the correct CORS settings.
                  </p>
                  <p className="text-sm font-medium text-red-700 mt-2">
                    After creating the bucket, click the Refresh button below.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || !bucketExists}
                className="bg-green-500 hover:bg-green-600 text-white flex gap-2 items-center"
                type="button"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload File"}
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*, audio/*, video/*"
                onChange={handleFileChange}
                disabled={uploading || !bucketExists}
                className="hidden"
              />
              {uploading && <Loader2 className="animate-spin h-4 w-4" />}
            </div>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm"
              disabled={loading}
              className="ml-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> 
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
          
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
            
            <TabsContent value={activeTab} className="border rounded-md p-2 h-[50vh] overflow-y-auto bg-white">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <Loader2 className="animate-spin h-8 w-8" />
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
                      className="relative group cursor-pointer border rounded-md p-2 hover:bg-gray-50 transition-colors"
                      onClick={() => handleSelect(item.url)}
                    >
                      {renderMediaItem(item)}
                      <div className="mt-1 flex items-center gap-1">
                        {getMediaIcon(item.type)}
                        <span className="text-xs truncate">{item.name}</span>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm">
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibrary;
