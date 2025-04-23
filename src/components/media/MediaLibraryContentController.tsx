
import React from "react";
import { Button } from "@/components/ui/button";
import { MediaLibraryFileUploader } from "./MediaLibraryFileUploader";
import { MediaLibraryTabs } from "./MediaLibraryTabs";
import { MediaGallery } from "./MediaGallery";
import ImageAdjustmentPanel from "./ImageAdjustmentPanel";

interface MediaLibraryContentControllerProps {
  activeTabPanel: string;
  selectedImage: string | null;
  selectedAspectRatio: string;
  selectedSize: number;
  selectedLayout: string;
  items: any[];
  loading: boolean;
  bucketExists: boolean;
  uploading: boolean;
  activeTab: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadClick: () => void;
  onRefresh: () => void;
  setActiveTab: (tab: string) => void;
  onSelect: (url: string) => void;
  setSelectedImage: (url: string | null) => void;
  setActiveTabPanel: (panel: string) => void;
  onAspectRatioChange: (ratio: string) => void;
  onSizeChange: (size: number) => void;
  onLayoutChange: (layout: string) => void;
  handleConfirmSelection: () => void;
}

const MediaLibraryContentController: React.FC<MediaLibraryContentControllerProps> = ({
  activeTabPanel,
  selectedImage,
  selectedAspectRatio,
  selectedSize,
  selectedLayout,
  items,
  loading,
  bucketExists,
  uploading,
  activeTab,
  fileInputRef,
  onFileChange,
  onUploadClick,
  onRefresh,
  setActiveTab,
  onSelect,
  setSelectedImage,
  setActiveTabPanel,
  onAspectRatioChange,
  onSizeChange,
  onLayoutChange,
  handleConfirmSelection,
}) => {
  // Render different content based on the active tab panel
  // Instead of using TabsContent directly, we'll conditionally render content
  return (
    <div>
      {activeTabPanel === "browse" && (
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
      )}
      
      {activeTabPanel === "adjust" && (
        <div>
          {selectedImage ? (
            <ImageAdjustmentPanel
              imageUrl={selectedImage}
              aspectRatio={selectedAspectRatio || "16/9"}
              size={selectedSize || 100}
              layout={selectedLayout || "standard"}
              onAspectRatioChange={onAspectRatioChange}
              onSizeChange={onSizeChange}
              onLayoutChange={onLayoutChange}
            />
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No image selected. Please select an image first.</p>
            </div>
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
              disabled={!selectedImage}
            >
              Confirm Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryContentController;
