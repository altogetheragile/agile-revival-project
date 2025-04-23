
import React from "react";
import { useMediaLibraryContext } from "./context/MediaLibraryContext";
import MediaBrowseTab from "./tabs/MediaBrowseTab";
import MediaAdjustTab from "./tabs/MediaAdjustTab";

interface MediaLibraryContentControllerProps {
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadClick: () => void;
}

const MediaLibraryContentController: React.FC<MediaLibraryContentControllerProps> = ({
  uploading,
  fileInputRef,
  onFileChange,
  onUploadClick,
}) => {
  const { activeTabPanel } = useMediaLibraryContext();

  // Render different content based on the active tab panel
  return (
    <div>
      {activeTabPanel === "browse" && (
        <MediaBrowseTab
          fileInputRef={fileInputRef}
          onFileChange={onFileChange}
          onUploadClick={onUploadClick}
          uploading={uploading}
        />
      )}
      
      {activeTabPanel === "adjust" && (
        <MediaAdjustTab />
      )}
    </div>
  );
};

export default MediaLibraryContentController;
