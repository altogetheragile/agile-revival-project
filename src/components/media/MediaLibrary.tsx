
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMediaLibrary } from "@/hooks/storage/useMediaLibrary";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaLibraryHeader } from "./header/MediaLibraryHeader";
import { StorageErrors } from "./errors/StorageErrors";
import { MediaLibraryTabsContent } from "./tabs/MediaLibraryTabsContent";

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

  useEffect(() => {
    if (open) {
      fetchMedia();
      console.log("MediaLibrary opened with state:", {
        selectedImage,
        selectedAspectRatio,
        selectedSize,
        selectedLayout,
        activeTabPanel
      });
    } else {
      setActiveTabPanel("browse");
    }
  }, [open, fetchMedia]);

  const handleSelect = (url: string) => {
    console.log("Image selected:", url);
    setSelectedImage(url);
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

  const handleTabChange = (value: string) => {
    setActiveTabPanel(value);
    console.log("Tab changed to:", value);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      console.log("Dialog onOpenChange called with:", isOpen);
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <MediaLibraryHeader />
        <StorageErrors error={error} bucketExists={bucketExists} />
        
        <Tabs value={activeTabPanel} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="browse" className="flex-1">Browse Media</TabsTrigger>
            <TabsTrigger value="adjust" className="flex-1" disabled={!selectedImage}>
              Adjust Image
            </TabsTrigger>
          </TabsList>
          
          <MediaLibraryTabsContent
            activeTabPanel={activeTabPanel}
            selectedImage={selectedImage}
            selectedAspectRatio={selectedAspectRatio}
            selectedSize={selectedSize}
            selectedLayout={selectedLayout}
            items={items}
            loading={loading}
            bucketExists={bucketExists}
            uploading={uploading}
            activeTab={activeTab}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onUploadClick={() => fileInputRef.current?.click()}
            onRefresh={handleRefresh}
            setActiveTab={setActiveTab}
            onSelect={handleSelect}
            setSelectedImage={setSelectedImage}
            setActiveTabPanel={setActiveTabPanel}
            onAspectRatioChange={setSelectedAspectRatio}
            onSizeChange={setSelectedSize}
            onLayoutChange={setSelectedLayout}
            handleConfirmSelection={handleConfirmSelection}
          />
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibrary;
