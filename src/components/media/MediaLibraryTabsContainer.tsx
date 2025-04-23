
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaLibraryTabsContainerProps {
  activeTabPanel: string;
  onTabChange: (value: string) => void;
  selectedImage: string | null;
}

const MediaLibraryTabsContainer: React.FC<MediaLibraryTabsContainerProps> = ({
  activeTabPanel,
  onTabChange,
  selectedImage
}) => {
  return (
    <Tabs 
      value={activeTabPanel} 
      onValueChange={onTabChange} 
      className="w-full"
    >
      <TabsList className="w-full">
        <TabsTrigger value="browse" className="flex-1">Browse Media</TabsTrigger>
        <TabsTrigger value="adjust" className="flex-1" disabled={!selectedImage}>
          Adjust Image
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default MediaLibraryTabsContainer;

