
import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
import { useMediaLibrary } from "@/hooks/storage/useMediaLibrary";
import { useToast } from "@/hooks/use-toast";
import { MediaLibraryHeader } from "./header/MediaLibraryHeader";
import { StorageErrors } from "./errors/StorageErrors";
import MediaLibraryTabsContainer from "./MediaLibraryTabsContainer";
import MediaLibraryContentController from "./MediaLibraryContentController";
import { MediaLibraryProvider } from "./context/MediaLibraryContext";

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
  const [activeTabPanel, setActiveTabPanel] = useState("browse");
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Use a callback for fetching to prevent unnecessary re-renders
  const refreshMedia = useCallback(() => {
    console.log("Refreshing media library...");
    fetchMedia();
  }, [fetchMedia]);

  useEffect(() => {
    if (open) {
      // Refresh media whenever dialog is opened
      refreshMedia();
    } else {
      // Reset to browse tab when dialog closes
      setActiveTabPanel("browse");
    }
  }, [open, refreshMedia]);

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
          // Refresh the media library after successful upload
          refreshMedia();
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
    refreshMedia();
    toast({
      title: "Refreshing media library",
      description: "Checking for new media files..."
    });
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

        <MediaLibraryProvider
          items={items}
          loading={loading}
          bucketExists={bucketExists}
          onSelect={onSelect}
          onClose={() => onOpenChange(false)}
          onRefresh={handleRefresh}
        >
          <Tabs value={activeTabPanel} onValueChange={handleTabChange}>
            <MediaLibraryTabsContainer 
              activeTabPanel={activeTabPanel} 
              onTabChange={handleTabChange}
            />

            <MediaLibraryContentController
              uploading={uploading}
              fileInputRef={fileInputRef}
              onFileChange={handleFileChange}
              onUploadClick={() => fileInputRef.current?.click()}
            />
          </Tabs>
        </MediaLibraryProvider>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibraryDialog;
