
import React, { useEffect, useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BlogPostFormData } from "@/types/blog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Settings, RefreshCw, Smartphone, Star } from "lucide-react";
import { toast } from "sonner";
import { getGlobalCacheBust, synchronizeImageUrls, makeThisBrowserMasterSource } from "@/utils/courseStorage";

interface BlogImageFieldProps {
  form: UseFormReturn<BlogPostFormData>;
  onOpenMediaLibrary: () => void;
}

export const BlogImageField: React.FC<BlogImageFieldProps> = ({ form, onOpenMediaLibrary }) => {
  const [refreshKey, setRefreshKey] = useState<number>(Date.now());
  const [globalCacheBust, setGlobalCacheBust] = useState<string>(getGlobalCacheBust());
  const [deviceInfo, setDeviceInfo] = useState<string>("");
  const [isMasterSource, setIsMasterSource] = useState<boolean>(
    localStorage.getItem('agile-trainer-master-source') === 'true'
  );

  // Get device info for better debugging
  useEffect(() => {
    const browser = navigator.userAgent;
    const platform = navigator.platform;
    const device = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
    setDeviceInfo(`${device} - ${platform}`);
  }, []);

  // Periodically check for global cache bust changes
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentBust = getGlobalCacheBust();
      const currentMasterStatus = localStorage.getItem('agile-trainer-master-source') === 'true';
      
      if (currentBust !== globalCacheBust) {
        setGlobalCacheBust(currentBust);
        console.log("Updated blog image field with new cache bust key:", currentBust);
        // Force a re-render of the image
        setRefreshKey(Date.now());
      }
      
      if (currentMasterStatus !== isMasterSource) {
        setIsMasterSource(currentMasterStatus);
      }
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [globalCacheBust, isMasterSource]);

  // Log initial values when component mounts
  useEffect(() => {
    const imageUrl = form.getValues("imageUrl");
    const aspectRatio = form.getValues("imageAspectRatio");
    const imageSize = form.getValues("imageSize");
    const imageLayout = form.getValues("imageLayout");
    
    console.log("BlogImageField initialized with:", {
      imageUrl,
      aspectRatio,
      imageSize,
      imageLayout,
      cacheBust: globalCacheBust,
      deviceInfo
    });
  }, [form, globalCacheBust, deviceInfo]);

  const handleRemoveImage = () => {
    console.log("Removing blog image");
    form.setValue("imageUrl", "", { shouldValidate: true });
    form.setValue("imageAspectRatio", "16/9", { shouldValidate: false });
    form.setValue("imageSize", 100, { shouldValidate: false });
    form.setValue("imageLayout", "standard", { shouldValidate: false });
  };

  const handleRefreshImage = () => {
    // Get the current image URL
    const currentUrl = form.getValues("imageUrl");
    if (!currentUrl) return;

    // Force a refresh by updating the URL with a new cache-busting parameter
    const baseUrl = currentUrl.split('?')[0];
    const newTimestamp = Date.now();
    const newUrl = `${baseUrl}?v=${newTimestamp}`;
    
    // Update the form value
    form.setValue("imageUrl", newUrl, { shouldValidate: true });
    
    // Update the refresh key to force re-render
    setRefreshKey(newTimestamp);
    
    // Show toast notification
    toast.success("Image refreshed", {
      description: "The image has been refreshed from source."
    });
  };

  const handleSyncAcrossDevices = () => {
    toast.success("Synchronizing images", {
      description: "Making all your devices show the same images. Page will refresh."
    });
    
    setTimeout(() => {
      synchronizeImageUrls();
    }, 1000);
  };
  
  const handleMakeMasterSource = () => {
    toast.success("Setting Master Source", {
      description: "This browser is now the authoritative source for images. All other devices will sync to match."
    });
    
    setTimeout(() => {
      makeThisBrowserMasterSource();
    }, 1000);
  };

  // Listen for keyboard shortcut Cmd+Shift+R or Ctrl+Shift+R to refresh image
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'r') {
        e.preventDefault();
        const imageUrl = form.getValues("imageUrl");
        if (imageUrl) {
          handleRefreshImage();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [form]);

  const imageUrl = form.watch("imageUrl");
  const aspectRatio = form.watch("imageAspectRatio") || "16/9";
  const imageSize = form.watch("imageSize") || 100;
  const imageLayout = form.watch("imageLayout") || "standard";
  
  // When any of these values change, log them
  useEffect(() => {
    console.log("Blog image field values changed:", {
      imageUrl,
      aspectRatio,
      imageSize,
      imageLayout,
      globalCacheBust,
      isMasterSource
    });
  }, [imageUrl, aspectRatio, imageSize, imageLayout, globalCacheBust, isMasterSource]);
  
  // Parse the aspect ratio string into a number
  const getAspectRatioValue = (ratio: string): number => {
    if (ratio === "auto") return undefined as any;
    const [width, height] = ratio.split("/").map(Number);
    return width / height;
  };

  // Add cache busting to image URL
  const getImageUrlWithCacheBusting = (url: string) => {
    if (!url) return "";
    
    // Use both specific refresh key and global cache bust plus a random component
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?v=${refreshKey}-${globalCacheBust}-${Date.now().toString().slice(-4)}`;
  };

  // Render image based on layout and settings
  const renderImage = () => {
    if (!imageUrl) return null;
    
    const cachedUrl = getImageUrlWithCacheBusting(imageUrl);
    const imageStyle = {
      width: `${imageSize}%`,
      maxWidth: '100%',
    };

    return (
      <div className="w-full" style={imageStyle}>
        {aspectRatio === "auto" ? (
          <img 
            src={cachedUrl}
            alt="Preview"
            className="w-full object-contain"
            key={`${refreshKey}-${globalCacheBust}`}
            onError={(e) => {
              console.error("Failed to load image:", cachedUrl);
              (e.target as HTMLImageElement).src = '/placeholder.svg';
              
              // Show a toast to suggest refreshing
              toast.error("Failed to load image", {
                description: "Try clicking the 'Refresh Image' button to reload it.",
                action: {
                  label: "Refresh",
                  onClick: handleRefreshImage
                }
              });
            }}
          />
        ) : (
          <AspectRatio ratio={getAspectRatioValue(aspectRatio)}>
            <img
              src={cachedUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              key={`${refreshKey}-${globalCacheBust}`}
              onError={(e) => {
                console.error("Failed to load image:", cachedUrl);
                (e.target as HTMLImageElement).src = '/placeholder.svg';
                
                // Show a toast to suggest refreshing
                toast.error("Failed to load image", {
                  description: "Try clicking the 'Refresh Image' button to reload it.",
                  action: {
                    label: "Refresh",
                    onClick: handleRefreshImage
                  }
                });
              }}
            />
          </AspectRatio>
        )}
      </div>
    );
  };

  return (
    <>
      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Blog Image URL
              <Button
                className="ml-2"
                type="button"
                size="sm"
                variant="secondary"
                onClick={onOpenMediaLibrary}
              >
                Choose from Library
              </Button>
              {field.value && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="ml-2 text-blue-500 border-blue-200"
                    onClick={handleRefreshImage}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Refresh Image
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="ml-2 text-green-600 border-green-200"
                    onClick={handleSyncAcrossDevices}
                  >
                    <Smartphone className="h-3.5 w-3.5 mr-1" />
                    Sync Across Devices
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={`ml-2 ${isMasterSource ? 'text-yellow-600 border-yellow-200 bg-yellow-50' : 'text-amber-600 border-amber-200'}`}
                    onClick={handleMakeMasterSource}
                    disabled={isMasterSource}
                  >
                    <Star className="h-3.5 w-3.5 mr-1" />
                    {isMasterSource ? 'Master Source' : 'Make Master Source'}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="ml-2 text-red-500 border-red-200"
                    onClick={handleRemoveImage}
                  >
                    Remove Image
                  </Button>
                </>
              )}
            </FormLabel>
            <FormControl>
              <div className="flex flex-col gap-2">
                <Input placeholder="https://example.com/image.jpg" {...field} />
                {field.value && (
                  <div className="mt-2 w-full max-w-md border rounded bg-white overflow-hidden">
                    {renderImage()}
                    <div className="p-3 bg-gray-50 border-t flex justify-between items-center text-sm text-gray-500">
                      <div>
                        {aspectRatio !== "auto" 
                          ? `${aspectRatio.replace("/", ":")} ratio` 
                          : "Original ratio"} 
                        {imageSize !== 100 && ` • ${imageSize}% size`}
                        {imageLayout !== "standard" && ` • ${imageLayout} layout`}
                        <div className="text-xs text-gray-400">
                          Device: {deviceInfo} | Cache: {globalCacheBust.substring(0, 6)}...
                          {refreshKey !== parseInt(globalCacheBust) && 
                            ` | Local: ${String(refreshKey).substring(0, 6)}...`}
                          {isMasterSource && ' | Master Source'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Base URL: {field.value.split('?')[0].substring(0, 40)}...
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex items-center gap-1"
                        onClick={onOpenMediaLibrary}
                      >
                        <Settings className="h-4 w-4" /> Adjust
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Add an image to your blog post
              {field.value && (
                <div>
                  <span 
                    className="text-xs block text-blue-500 cursor-pointer mt-1" 
                    onClick={handleRefreshImage}
                  >
                    <span className="font-bold">Tip:</span> Having trouble seeing image changes? Click "Refresh Image" or use Cmd+Shift+R / Ctrl+Shift+R
                  </span>
                  <span className="text-xs block text-green-500 cursor-pointer mt-1" onClick={handleSyncAcrossDevices}>
                    <span className="font-bold">Multi-device tip:</span> If images look different on your phone or other browsers, use "Sync Across Devices"
                  </span>
                </div>
              )}
            </FormDescription>
          </FormItem>
        )}
      />

      {/* Hidden fields to store image settings */}
      <FormField
        control={form.control}
        name="imageAspectRatio"
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />
      <FormField
        control={form.control}
        name="imageSize"
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />
      <FormField
        control={form.control}
        name="imageLayout"
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />
    </>
  );
};

export default BlogImageField;

