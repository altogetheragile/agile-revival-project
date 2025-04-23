
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMediaLibrary } from "@/hooks/storage/useMediaLibrary";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { MediaLibraryTabs } from "./MediaLibraryTabs";
import { MediaLibraryFileUploader } from "./MediaLibraryFileUploader";
import { MediaGallery } from "./MediaGallery";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string, aspectRatio?: string) => void;
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
  const [selectedAspectRatio, setSelectedAspectRatio] = React.useState<string>("16/9");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSelect = (url: string) => {
    onSelect(url, selectedAspectRatio);
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
        toast({
          title: "Upload failed",
          description: err.message || "There was a problem uploading your file",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
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
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <MediaLibraryFileUploader
                uploading={uploading}
                loading={loading}
                bucketExists={bucketExists}
                fileInputRef={fileInputRef}
                onFileChange={handleFileChange}
                onUploadClick={() => fileInputRef.current?.click()}
                onRefresh={handleRefresh}
              />
            </div>
            
            <div className="flex flex-col space-y-2 min-w-[180px]">
              <Label htmlFor="aspect-ratio">Image Aspect Ratio</Label>
              <Select 
                value={selectedAspectRatio} 
                onValueChange={setSelectedAspectRatio}
              >
                <SelectTrigger id="aspect-ratio">
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16/9">16:9 (Widescreen)</SelectItem>
                  <SelectItem value="4/3">4:3 (Standard)</SelectItem>
                  <SelectItem value="1/1">1:1 (Square)</SelectItem>
                  <SelectItem value="3/2">3:2 (Classic Photo)</SelectItem>
                  <SelectItem value="2/3">2:3 (Portrait)</SelectItem>
                  <SelectItem value="9/16">9:16 (Mobile)</SelectItem>
                  <SelectItem value="auto">Auto (Original)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <MediaLibraryTabs
            items={items}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <MediaGallery
            items={items}
            loading={loading}
            bucketExists={bucketExists}
            activeTab={activeTab}
            onSelect={handleSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibrary;
