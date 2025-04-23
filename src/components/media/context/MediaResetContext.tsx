
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { getGlobalCacheBust, setGlobalCacheBust } from '@/utils/courseStorage';

interface MediaResetContextType {
  resetMedia: () => void;
  cacheBust: string;
}

const MediaResetContext = createContext<MediaResetContextType | undefined>(undefined);

export const MediaResetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cacheBust, setCacheBust] = useState<string>(() => getGlobalCacheBust() || '1');

  // Initialize with the current cache bust value
  useEffect(() => {
    setCacheBust(getGlobalCacheBust() || '1');
  }, []);

  const resetMedia = () => {
    // Generate a new timestamp for cache busting
    const newCacheBust = Date.now().toString();
    setGlobalCacheBust(newCacheBust);
    setCacheBust(newCacheBust);
    toast.success('Media cache reset', {
      description: 'All images will now reload with fresh data'
    });
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

export const GlobalResetProvider: React.FC = () => {
  return <MediaResetProvider><></></MediaResetProvider>;
};
