
import { useState, useEffect, useCallback } from 'react';
import { getGlobalCacheBust } from "@/utils/cacheBusting";
import { toast } from "sonner";

// Define TypeScript interfaces for better type safety
export interface RefreshKeys {
  [url: string]: number;
}

export interface MediaRefreshOptions {
  pollingInterval?: number;
  showToasts?: boolean;
}

export interface MediaRefreshResult {
  globalCacheBust: string;
  refreshKeys: RefreshKeys;
  refreshImage: (url: string) => void;
  refreshAllImages: (urls: string[]) => void;
  getImageUrl: (baseUrl: string) => string;
  resetRefreshKeys: () => void;
}

/**
 * A hook for managing media refresh states and cache busting
 * @param options Configuration options for the hook
 * @returns Methods and state for media refreshing
 */
export const useMediaRefresh = (options: MediaRefreshOptions = {}): MediaRefreshResult => {
  const { 
    pollingInterval = 2000, 
    showToasts = true 
  } = options;
  
  const [globalCacheBust, setGlobalCacheBust] = useState<string>(getGlobalCacheBust());
  const [refreshKeys, setRefreshKeys] = useState<RefreshKeys>({});

  // Refresh a single image
  const refreshImage = useCallback((url: string): void => {
    if (!url) {
      console.warn("Attempted to refresh an empty URL");
      return;
    }

    setRefreshKeys(prev => ({
      ...prev,
      [url]: Date.now()
    }));
    
    if (showToasts) {
      toast.success("Image refreshed", {
        description: "The image has been refreshed from source."
      });
    }
  }, [showToasts]);

  // Refresh multiple images at once
  const refreshAllImages = useCallback((urls: string[]): void => {
    if (!urls.length) {
      console.warn("No URLs provided for refresh");
      return;
    }

    const newKeys: RefreshKeys = {};
    const timestamp = Date.now();
    
    urls.forEach(url => {
      if (url) {
        newKeys[url] = timestamp;
      }
    });
    
    setRefreshKeys(prev => ({
      ...prev,
      ...newKeys
    }));
    
    // Also update global cache bust to ensure all images update
    setGlobalCacheBust(getGlobalCacheBust());
    
    if (showToasts) {
      toast.success("All images refreshed", {
        description: `${urls.length} images in the gallery have been refreshed from source.`
      });
    }
  }, [showToasts]);

  // Get a cache-busted image URL
  const getImageUrl = useCallback((baseUrl: string): string => {
    if (!baseUrl) return '';
    
    const refreshKey = refreshKeys[baseUrl] || globalCacheBust;
    return `${baseUrl.split('?')[0]}?v=${refreshKey}`;
  }, [refreshKeys, globalCacheBust]);

  // Reset all refresh keys
  const resetRefreshKeys = useCallback((): void => {
    setRefreshKeys({});
  }, []);

  return {
    globalCacheBust,
    refreshKeys,
    refreshImage,
    refreshAllImages,
    getImageUrl,
    resetRefreshKeys
  };
};
