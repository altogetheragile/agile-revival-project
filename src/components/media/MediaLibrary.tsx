
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMediaLibrary } from "@/hooks/storage/useMediaLibrary";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { MediaLibraryTabs } from "./MediaLibraryTabs";
import { MediaLibraryFileUploader } from "./MediaLibraryFileUploader";
import { MediaGallery } from "./MediaGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageAdjustmentPanel from "./ImageAdjustmentPanel";
import { Button } from "@/components/ui/button";

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string, aspectRatio?: string, size?: number, layout?: string) => void;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ 
  open, 
  onOpenChange,
  onSelect
}) => {
  const { items, loading, upload, fetchMedia, bucketExists, error } = useMediaLibrary();
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = React.useState<string>("16/9");
  const [selectedSize, setSelectedSize] = React.useState<number>(100);
  const [selectedLayout, setSelectedLayout] = React.useState<string>("standard");
  const [activeTabPanel, setActiveTabPanel] = useState<string>("browse");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Log when component renders with current state
  React.useEffect(() => {
    if (open) {
      console.log("MediaLibrary opened with state:", {
        selectedImage,
        selectedAspectRatio,
        selectedSize,
        selectedLayout,
        activeTabPanel
      });
    }
  }, [open, selectedImage, selectedAspectRatio, selectedSize, selectedLayout, activeTabPanel]);

  const handleSelect = (url: string) => {
    console.log("Image selected:", url);
    setSelectedImage(url);
    // Automatically switch to adjust tab when an image is selected
    setActiveTabPanel("adjust");
  };

  const handleConfirmSelection = () => {
    if (selectedImage) {
      console.log("Confirming selection with:", selectedImage, selectedAspectRatio, selectedSize, selectedLayout);
      onSelect(selectedImage, selectedAspectRatio, selectedSize, selectedLayout);
      toast({
        title: "Media selected",
        description: "The selected media has been added with your adjustments."
      });
      onOpenChange(false);
    } else {
      toast({
        title: "No image selected",
        description: "Please select an image first.",
        variant: "destructive"
      });
    }
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

  // Handle tab change logic
  const handleTabChange = (value: string) => {
    setActiveTabPanel(value);
    console.log("Tab changed to:", value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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

        <Tabs value={activeTabPanel} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="browse" className="flex-1">Browse Media</TabsTrigger>
            <TabsTrigger value="adjust" className="flex-1" disabled={!selectedImage}>
              Adjust Image
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <div className="space-y-4">
              <div>
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
                selectedImage={selectedImage}
              />
              
              {selectedImage && (
                <div className="flex justify-end space-x-2 mt-4">
                  <Button 
                    onClick={() => setSelectedImage(null)}
                    variant="outline"
                  >
                    Clear Selection
                  </Button>
                  <Button 
                    onClick={() => setActiveTabPanel("adjust")}
                    variant="default"
                  >
                    Adjust Image
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="adjust">
            {selectedImage && (
              <ImageAdjustmentPanel
                imageUrl={selectedImage}
                aspectRatio={selectedAspectRatio}
                size={selectedSize}
                layout={selectedLayout}
                onAspectRatioChange={(ratio) => {
                  console.log("Aspect ratio changed to:", ratio);
                  setSelectedAspectRatio(ratio);
                }}
                onSizeChange={(size) => {
                  console.log("Size changed to:", size);
                  setSelectedSize(size);
                }}
                onLayoutChange={(layout) => {
                  console.log("Layout changed to:", layout);
                  setSelectedLayout(layout);
                }}
              />
            )}
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button 
                onClick={() => setActiveTabPanel("browse")}
                variant="outline"
              >
                Back to Browse
              </Button>
              <Button 
                onClick={handleConfirmSelection}
                variant="default"
              >
                Confirm Selection
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibrary;
