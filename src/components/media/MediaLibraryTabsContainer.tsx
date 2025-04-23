
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaLibraryContext } from "./context/MediaLibraryContext";

interface MediaLibraryTabsContainerProps {
  activeTabPanel: string;
  onTabChange: (value: string) => void;
}

const MediaLibraryTabsContainer: React.FC<MediaLibraryTabsContainerProps> = ({
  activeTabPanel,
  onTabChange
}) => {
  const { selectedImage } = useMediaLibraryContext();
  
  return (
    <TabsList className="w-full">
      <TabsTrigger value="browse" className="flex-1">Browse Media</TabsTrigger>
      <TabsTrigger value="adjust" className="flex-1" disabled={!selectedImage}>
        Adjust Image
      </TabsTrigger>
    </TabsList>
  );
};

export default MediaLibraryTabsContainer;
