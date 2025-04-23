
import React from 'react';
import { Button } from "@/components/ui/button";
import { MediaLibraryFileUploader } from "../MediaLibraryFileUploader";
import { MediaLibraryTabs } from "../MediaLibraryTabs";
import { MediaGallery } from "../MediaGallery";
import { useMediaLibraryContext } from "../context/MediaLibraryContext";

interface MediaBrowseTabProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadClick: () => void;
  uploading: boolean;
}

export const MediaBrowseTab: React.FC<MediaBrowseTabProps> = ({
  fileInputRef,
  onFileChange,
  onUploadClick,
  uploading
}) => {
  const {
    items,
    loading,
    bucketExists,
    activeTab,
    setActiveTab,
    onSelect,
    selectedImage,
    setSelectedImage,
    setActiveTabPanel,
    onRefresh
  } = useMediaLibraryContext();

  return (
    <div className="space-y-4">
      <div>
        <MediaLibraryFileUploader
          uploading={uploading}
          loading={loading}
          bucketExists={bucketExists}
          fileInputRef={fileInputRef}
          onFileChange={onFileChange}
          onUploadClick={onUploadClick}
          onRefresh={onRefresh}
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
        onSelect={onSelect}
        selectedImage={selectedImage}
      />
      
      {selectedImage && (
        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            onClick={() => {
              console.log("Clearing image selection");
              setSelectedImage(null);
            }}
            variant="outline"
          >
            Clear Selection
          </Button>
          <Button 
            onClick={() => {
              console.log("Moving to adjust panel");
              setActiveTabPanel("adjust");
            }}
            variant="default"
          >
            Adjust Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default MediaBrowseTab;
