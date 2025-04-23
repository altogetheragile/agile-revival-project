
import { useState, useEffect } from 'react';
import { getGlobalCacheBust } from "@/utils/courseStorage";
import { toast } from "sonner";

export const useMediaRefresh = () => {
  const [globalCacheBust, setGlobalCacheBust] = useState<string>(getGlobalCacheBust());
  const [refreshKeys, setRefreshKeys] = useState<Record<string, number>>({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentBust = getGlobalCacheBust();
      if (currentBust !== globalCacheBust) {
        setGlobalCacheBust(currentBust);
        console.log("Updated media refresh with new cache bust key:", currentBust);
      }
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [globalCacheBust]);

  const refreshImage = (url: string) => {
    setRefreshKeys(prev => ({
      ...prev,
      [url]: Date.now()
    }));
    
    toast.success("Image refreshed", {
      description: "The image has been refreshed from source."
    });
  };

  const refreshAllImages = (urls: string[]) => {
    const newKeys: Record<string, number> = {};
    const timestamp = Date.now();
    
    urls.forEach(url => {
      newKeys[url] = timestamp;
    });
    
    setRefreshKeys(newKeys);
    setGlobalCacheBust(getGlobalCacheBust());
    
    toast.success("All images refreshed", {
      description: "All images in the gallery have been refreshed from source."
    });
  };

  const getImageUrl = (baseUrl: string) => {
    const refreshKey = refreshKeys[baseUrl] || globalCacheBust;
    return `${baseUrl.split('?')[0]}?v=${refreshKey}`;
  };

  return {
    globalCacheBust,
    refreshKeys,
    refreshImage,
    refreshAllImages,
    getImageUrl
  };
};

