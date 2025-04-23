import React, { useEffect, useState, useCallback } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Settings, RefreshCw, Smartphone, Star } from "lucide-react";
import { toast } from "sonner";
import { getStorageVersion, getGlobalCacheBust, synchronizeImageUrls, makeThisBrowserMasterSource } from "@/utils/courseStorage";

interface CourseImageFieldProps {
  form: UseFormReturn<CourseFormData>;
  onOpenMediaLibrary: () => void;
}

export const CourseImageField: React.FC<CourseImageFieldProps> = ({ form, onOpenMediaLibrary }) => {
  const [refreshKey, setRefreshKey] = useState<number>(Date.now());
  const [globalCacheBust, setGlobalCacheBust] = useState<string>(getGlobalCacheBust());
  const [deviceInfo, setDeviceInfo] = useState<string>("");
  const [isMasterSource, setIsMasterSource] = useState<boolean>(
    localStorage.getItem('agile-trainer-master-source') === 'true'
  );

  useEffect(() => {
    const browser = navigator.userAgent;
    const platform = navigator.platform;
    const device = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
    setDeviceInfo(`${device} - ${platform}`);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentBust = getGlobalCacheBust();
      const currentMasterStatus = localStorage.getItem('agile-trainer-master-source') === 'true';
      
      if (currentBust !== globalCacheBust) {
        setGlobalCacheBust(currentBust);
        console.log("Updated course image field with new cache bust key:", currentBust);
        setRefreshKey(Date.now());
      }
      
      if (currentMasterStatus !== isMasterSource) {
        setIsMasterSource(currentMasterStatus);
      }
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [globalCacheBust, isMasterSource]);

  useEffect(() => {
    const imageUrl = form.getValues("imageUrl");
    const aspectRatio = form.getValues("imageAspectRatio" as any);
    const imageSize = form.getValues("imageSize" as any);
    const imageLayout = form.getValues("imageLayout" as any);
    
    console.log("CourseImageField initialized with:", {
      imageUrl,
      aspectRatio,
      imageSize,
      imageLayout,
      cacheBust: globalCacheBust,
      deviceInfo
    });
  }, [form, globalCacheBust, deviceInfo]);

  const handleRemoveImage = () => {
    console.log("Removing course image");
    form.setValue("imageUrl", "", { shouldValidate: true });
    form.setValue("imageAspectRatio" as any, "16/9", { shouldValidate: false });
    form.setValue("imageSize" as any, 100, { shouldValidate: false });
    form.setValue("imageLayout" as any, "standard", { shouldValidate: false });
  };

  const handleRefreshImage = useCallback(() => {
    const currentUrl = form.getValues("imageUrl");
    if (!currentUrl) return;

    const baseUrl = currentUrl.split('?')[0];
    const newTimestamp = Date.now();
    const newUrl = `${baseUrl}?v=${newTimestamp}`;
    
    form.setValue("imageUrl", newUrl, { shouldValidate: true });
    setRefreshKey(newTimestamp);
    toast.success("Image refreshed", {
      description: "The image has been refreshed from source."
    });
  }, [form]);

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
  }, [handleRefreshImage, form]);

  const imageUrl = form.watch("imageUrl");
  const aspectRatio = form.watch("imageAspectRatio" as any) || "16/9";
  const imageSize = form.watch("imageSize" as any) || 100;
  const imageLayout = form.watch("imageLayout" as any) || "standard";
  
  useEffect(() => {
    console.log("Course image field values changed:", {
      imageUrl,
      aspectRatio,
      imageSize,
      imageLayout,
      storageVersion: getStorageVersion(),
      globalCacheBust: getGlobalCacheBust(),
      deviceInfo
    });
  }, [imageUrl, aspectRatio, imageSize, imageLayout, deviceInfo]);
  
  const getAspectRatioValue = (ratio: string): number => {
    if (ratio === "auto") return undefined as any;
    const [width, height] = ratio.split("/").map(Number);
    return width / height;
  };

  const getImageUrlWithCacheBusting = (url: string) => {
    if (!url) return "";
    
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?v=${refreshKey}-${globalCacheBust}-${Date.now().toString().slice(-4)}`;
  };

  const renderImage = () => {
    if (!imageUrl) return null;
    
    const cachedImageUrl = getImageUrlWithCacheBusting(imageUrl);
    
    const imageStyle = {
      width: `${imageSize}%`,
      maxWidth: '100%',
    };

    if (!imageLayout || imageLayout === "standard") {
      return (
        <div className="w-full" style={imageStyle}>
          {aspectRatio === "auto" ? (
            <img 
              src={cachedImageUrl}
              alt="Preview"
              className="w-full object-contain"
              key={`${refreshKey}-${globalCacheBust}`}
              onError={(e) => {
                console.error("Failed to load image:", cachedImageUrl);
                (e.target as HTMLImageElement).src = "/placeholder.svg";
                
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
                src={cachedImageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                key={`${refreshKey}-${globalCacheBust}`}
                onError={(e) => {
                  console.error("Failed to load image:", cachedImageUrl);
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                  
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
    }
    
    return (
      <div className="w-full" style={imageStyle}>
        {aspectRatio === "auto" ? (
          <img 
            src={cachedImageUrl}
            alt="Preview"
            className="w-full object-contain"
            key={`${refreshKey}-${globalCacheBust}`}
            onError={(e) => {
              console.error("Failed to load image:", cachedImageUrl);
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        ) : (
          <AspectRatio ratio={getAspectRatioValue(aspectRatio)}>
            <img
              src={cachedImageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              key={`${refreshKey}-${globalCacheBust}`}
              onError={(e) => {
                console.error("Failed to load image:", cachedImageUrl);
                (e.target as HTMLImageElement).src = "/placeholder.svg";
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
              Course Image URL
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
              This image will be shown in course details and listings.
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
                  {!isMasterSource && (
                    <span className="text-xs block text-amber-500 cursor-pointer mt-1" onClick={handleMakeMasterSource}>
                      <span className="font-bold">Advanced tip:</span> To make your current image the one all browsers use, click "Make Master Source"
                    </span>
                  )}
                </div>
              )}
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name={"imageAspectRatio" as any}
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />
      <FormField
        control={form.control}
        name={"imageSize" as any}
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />
      <FormField
        control={form.control}
        name={"imageLayout" as any}
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />
    </>
  );
};
