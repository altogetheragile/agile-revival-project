
import React, { createContext, useState, useContext } from 'react';
import { toast } from 'sonner';
import { getGlobalCacheBust } from '@/utils/cacheBusting';

interface MediaResetContextType {
  resetMedia: () => void;
  cacheBust: string;
}

const MediaResetContext = createContext<MediaResetContextType | undefined>(undefined);

export const MediaResetProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [cacheBust, setCacheBust] = useState<string>(getGlobalCacheBust());

  const resetMedia = () => {
    const newCacheBust = Date.now().toString();
    setCacheBust(newCacheBust);
    toast.success('Media cache reset');
  };

  return (
    <MediaResetContext.Provider value={{ resetMedia, cacheBust }}>
      {children}
    </MediaResetContext.Provider>
  );
};

export const useMediaReset = (): MediaResetContextType => {
  const context = useContext(MediaResetContext);
  if (context === undefined) {
    throw new Error('useMediaReset must be used within a MediaResetProvider');
  }
  return context;
};

