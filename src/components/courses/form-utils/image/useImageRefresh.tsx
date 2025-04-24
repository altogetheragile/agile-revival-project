
import { useState, useEffect, useCallback } from 'react';
import { getGlobalCacheBust } from "@/utils/cacheBusting";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";

interface UseImageRefreshProps {
  form: UseFormReturn<any>;
  imageUrlField: string;
}

export const useImageRefresh = ({ form, imageUrlField }: UseImageRefreshProps) => {
  const [refreshKey, setRefreshKey] = useState<number>(Date.now());
  const [globalCacheBust, setGlobalCacheBust] = useState<string>(getGlobalCacheBust());

  // Handle removing image
  const handleRemoveImage = useCallback(() => {
    console.log("Removing course image");
    form.setValue(imageUrlField, "", { shouldValidate: true });
    // Clear all image related settings
    form.setValue("imageAspectRatio" as any, "16/9", { shouldValidate: false });
    form.setValue("imageSize" as any, 100, { shouldValidate: false });
    form.setValue("imageLayout" as any, "standard", { shouldValidate: false });
  }, [form, imageUrlField]);

  // Handle refreshing image - applies a new cache bust parameter
  const handleRefreshImage = useCallback(() => {
    // Get the current image URL
    const currentUrl = form.getValues(imageUrlField);
    if (!currentUrl) return;

    // Force a refresh by updating the URL with a new cache-busting parameter
    const baseUrl = currentUrl.split('?')[0];
    const newTimestamp = Date.now();
    const newUrl = `${baseUrl}?v=${newTimestamp}`;
    
    // Update the form value
    form.setValue(imageUrlField, newUrl, { shouldValidate: true });
    
    // Update the refresh key to force re-render
    setRefreshKey(newTimestamp);
    
    // Show toast notification
    toast.success("Image refreshed", {
      description: "The image has been refreshed from source."
    });
  }, [form, imageUrlField]);

  // Return the image URL exactly as stored - don't re-apply cache busting
  const getImageUrlWithCacheBusting = useCallback((url: string) => {
    if (!url) return "";
    
    // Just return the URL as is - already has cache busting from storage
    return url;
  }, []);

  return {
    refreshKey,
    globalCacheBust,
    handleRemoveImage,
    handleRefreshImage,
    getImageUrlWithCacheBusting
  };
};

export default useImageRefresh;
