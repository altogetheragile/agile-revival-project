
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
import { useMediaLibrary } from "@/hooks/storage/useMediaLibrary";
import { useToast } from "@/hooks/use-toast";
import { MediaLibraryHeader } from "./header/MediaLibraryHeader";
import { StorageErrors } from "./errors/StorageErrors";
import MediaLibraryTabsContainer from "./MediaLibraryTabsContainer";
import MediaLibraryContentController from "./MediaLibraryContentController";

interface MediaLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (
    url: string,
    aspectRatio?: string,
    size?: number,
    layout?: string
  ) => void;
}

const MediaLibraryDialog: React.FC<MediaLibraryDialogProps> = ({
  open,
  onOpenChange,
  onSelect
}) => {
  const { items, loading, upload, fetchMedia, bucketExists, error } = useMediaLibrary();
  const { toast } = useToast();

  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [activeTabPanel, setActiveTabPanel] = useState("browse");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("16/9");
  const [selectedSize, setSelectedSize] = useState<number>(100);
  const [selectedLayout, setSelectedLayout] = useState<string>("standard");

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

  const handleRefresh = () => {
    fetchMedia();
    toast({
      title: "Refreshing media library",
      description: "Checking for new media files..."
    });
  };

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

  const handleTabChange = (value: string) => {
    setActiveTabPanel(value);
    console.log("Tab changed to:", value);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        console.log("Dialog onOpenChange called with:", isOpen);
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <MediaLibraryHeader />
        <StorageErrors error={error} bucketExists={bucketExists} />

        <Tabs value={activeTabPanel} onValueChange={handleTabChange}>
          <MediaLibraryTabsContainer 
            activeTabPanel={activeTabPanel} 
            onTabChange={handleTabChange} 
            selectedImage={selectedImage} 
          />

          <MediaLibraryContentController
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

export default MediaLibraryDialog;
