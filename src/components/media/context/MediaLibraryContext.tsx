
import React, { createContext, useContext, useState, useEffect } from 'react';

interface MediaItem {
  name: string;
  url: string;
  type: string;
}

interface MediaLibraryContextType {
  activeTabPanel: string;
  setActiveTabPanel: (panel: string) => void;
  selectedImage: string | null;
  setSelectedImage: (url: string | null) => void;
  selectedAspectRatio: string;
  setSelectedAspectRatio: (ratio: string) => void;
  selectedSize: number;
  setSelectedSize: (size: number) => void;
  selectedLayout: string;
  setSelectedLayout: (layout: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleConfirmSelection: () => void;
  items: MediaItem[];
  loading: boolean;
  bucketExists: boolean;
  onSelect: (url: string) => void;
  onRefresh: () => void;
}

const MediaLibraryContext = createContext<MediaLibraryContextType | undefined>(undefined);

export const useMediaLibraryContext = () => {
  const context = useContext(MediaLibraryContext);
  if (context === undefined) {
    throw new Error('useMediaLibraryContext must be used within a MediaLibraryProvider');
  }
  return context;
};

interface MediaLibraryProviderProps {
  children: React.ReactNode;
  items: MediaItem[];
  loading: boolean;
  bucketExists: boolean;
  onSelect: (
    url: string,
    aspectRatio?: string,
    size?: number,
    layout?: string
  ) => void;
  onClose: () => void;
  onRefresh: () => void;
}

export const MediaLibraryProvider: React.FC<MediaLibraryProviderProps> = ({
  children,
  items,
  loading,
  bucketExists,
  onSelect: selectHandler,
  onClose,
  onRefresh
}) => {
  // State for currently selected media
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("16/9");
  const [selectedSize, setSelectedSize] = useState<number>(100);
  const [selectedLayout, setSelectedLayout] = useState<string>("standard");

  // Tab state
  const [activeTabPanel, setActiveTabPanel] = useState("browse");
  const [activeTab, setActiveTab] = useState("all");
  
  // Cache busting for selected images
  const [cacheBustKey, setCacheBustKey] = useState<string>(Date.now().toString());

  // Log when settings are changed to debug persistence issues
  useEffect(() => {
    if (selectedImage) {
      console.log("MediaLibraryContext settings updated:", {
        aspectRatio: selectedAspectRatio,
        size: selectedSize,
        layout: selectedLayout,
        cacheBustKey
      });
    }
  }, [selectedImage, selectedAspectRatio, selectedSize, selectedLayout, cacheBustKey]);

  // Reset selections when dialog is closed
  useEffect(() => {
    // Generate a new cache bust key whenever the media library is opened
    setCacheBustKey(Date.now().toString());
  }, [items]);

  // Handle image selection
  const onSelect = (url: string) => {
    console.log("Image selected:", url);
    
    // Add cache busting parameter to ensure the image is fresh
    const baseUrl = url.split('?')[0];
    const cacheBustedUrl = `${baseUrl}?v=${cacheBustKey}`;
    
    setSelectedImage(cacheBustedUrl);
    
    // Automatically move to the adjust tab when an image is selected
    setActiveTabPanel("adjust");
  };

  // Handle final confirmation
  const handleConfirmSelection = () => {
    if (selectedImage) {
      console.log("Confirming selection with settings:", {
        image: selectedImage, 
        aspectRatio: selectedAspectRatio, 
        size: selectedSize, 
        layout: selectedLayout
      });
      
      // Important: Pass all settings to the selectHandler
      selectHandler(
        selectedImage,
        selectedAspectRatio,
        selectedSize,
        selectedLayout
      );
      
      // Reset selected image after confirmation
      setSelectedImage(null);
      
      // Reset to browse tab for next use
      setActiveTabPanel("browse");
      setActiveTab("all");
      
      // Close dialog
      onClose();
    }
  };

  const value = {
    activeTabPanel,
    setActiveTabPanel,
    selectedImage,
    setSelectedImage,
    selectedAspectRatio,
    setSelectedAspectRatio,
    selectedSize,
    setSelectedSize,
    selectedLayout,
    setSelectedLayout,
    activeTab,
    setActiveTab,
    handleConfirmSelection,
    items,
    loading,
    bucketExists,
    onSelect,
    onRefresh
  };

  return (
    <MediaLibraryContext.Provider value={value}>
      {children}
    </MediaLibraryContext.Provider>
  );
};

export default MediaLibraryProvider;
