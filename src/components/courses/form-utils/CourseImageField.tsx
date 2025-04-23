
import React, { useEffect, useState, useCallback } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Settings, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getStorageVersion, getGlobalCacheBust } from "@/utils/courseStorage";

interface CourseImageFieldProps {
  form: UseFormReturn<CourseFormData>;
  onOpenMediaLibrary: () => void;
}

export const CourseImageField: React.FC<CourseImageFieldProps> = ({ form, onOpenMediaLibrary }) => {
  const [refreshKey, setRefreshKey] = useState<number>(Date.now());
  const [globalCacheBust, setGlobalCacheBust] = useState<string>(getGlobalCacheBust());

  // Periodically check for global cache bust changes
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentBust = getGlobalCacheBust();
      if (currentBust !== globalCacheBust) {
        setGlobalCacheBust(currentBust);
        console.log("Updated course image field with new cache bust key:", currentBust);
        // Force a re-render of the image
        setRefreshKey(Date.now());
      }
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [globalCacheBust]);

  // Log initial values when component mounts
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
      cacheBust: globalCacheBust
    });
  }, [form, globalCacheBust]);

  const handleRemoveImage = () => {
    console.log("Removing course image");
    form.setValue("imageUrl", "", { shouldValidate: true });
    // Clear all image related settings
    form.setValue("imageAspectRatio" as any, "16/9", { shouldValidate: false });
    form.setValue("imageSize" as any, 100, { shouldValidate: false });
    form.setValue("imageLayout" as any, "standard", { shouldValidate: false });
  };

  const handleRefreshImage = useCallback(() => {
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
  }, [form]);

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
  }, [handleRefreshImage, form]);

  const imageUrl = form.watch("imageUrl");
  const aspectRatio = form.watch("imageAspectRatio" as any) || "16/9";
  const imageSize = form.watch("imageSize" as any) || 100;
  const imageLayout = form.watch("imageLayout" as any) || "standard";
  
  // When any of these values change, log them
  useEffect(() => {
    console.log("Course image field values changed:", {
      imageUrl,
      aspectRatio,
      imageSize,
      imageLayout,
      storageVersion: getStorageVersion(),
      globalCacheBust: getGlobalCacheBust()
    });
  }, [imageUrl, aspectRatio, imageSize, imageLayout]);
  
  // Parse the aspect ratio string into a number
  const getAspectRatioValue = (ratio: string): number => {
    if (ratio === "auto") return undefined as any; // Let the image use its natural ratio
    const [width, height] = ratio.split("/").map(Number);
    return width / height;
  };

  // Add cache busting to image URL
  const getImageUrlWithCacheBusting = (url: string) => {
    if (!url) return "";
    
    // Use both specific refresh key and global cache bust
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?v=${refreshKey}-${globalCacheBust}`;
  };

  // Render image based on layout
  const renderImage = () => {
    if (!imageUrl) return null;
    
    const cachedImageUrl = getImageUrlWithCacheBusting(imageUrl);
    
    const imageStyle = {
      width: `${imageSize}%`,
      maxWidth: '100%',
    };

    // Standard layout (default)
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
                // Set a fallback or display an error indicator
                (e.target as HTMLImageElement).src = "/placeholder.svg";
                
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
                src={cachedImageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                key={`${refreshKey}-${globalCacheBust}`}
                onError={(e) => {
                  console.error("Failed to load image:", cachedImageUrl);
                  // Set a fallback or display an error indicator
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                  
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
                          Cache: {globalCacheBust.substring(0, 6)}...
                          {refreshKey !== parseInt(globalCacheBust) && 
                            ` | Local: ${String(refreshKey).substring(0, 6)}...`}
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
                </div>
              )}
            </FormDescription>
          </FormItem>
        )}
      />
      
      {/* Hidden fields to store image adjustment values */}
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
