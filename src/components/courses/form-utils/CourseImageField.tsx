import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { toast } from "sonner";
import { useImageRefresh } from "./image/useImageRefresh";
import CourseImagePreview from "./image/CourseImagePreview";
import CourseImageInfo from "./image/CourseImageInfo";
import CourseImageActions from "./image/CourseImageActions";

interface CourseImageFieldProps {
  form: UseFormReturn<CourseFormData>;
  onOpenMediaLibrary: () => void;
}

export const CourseImageField: React.FC<CourseImageFieldProps> = ({ form, onOpenMediaLibrary }) => {
  const { 
    refreshKey,
    globalCacheBust,
    handleRemoveImage,
    handleRefreshImage,
    getImageUrlWithCacheBusting
  } = useImageRefresh({ 
    form,
    imageUrlField: "imageUrl"
  });

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
    });
  }, [imageUrl, aspectRatio, imageSize, imageLayout]);

  return (
    <>
      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Course Image URL
              {!field.value && (
                <Button
                  className="ml-2"
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={onOpenMediaLibrary}
                >
                  Choose from Library
                </Button>
              )}
              {field.value && (
                <CourseImageActions 
                  handleRefreshImage={handleRefreshImage}
                  handleRemoveImage={handleRemoveImage}
                  onOpenMediaLibrary={onOpenMediaLibrary}
                />
              )}
            </FormLabel>
            <FormControl>
              <div className="flex flex-col gap-2">
                <Input placeholder="https://example.com/image.jpg" {...field} />
                {field.value && (
                  <div className="mt-2 w-full max-w-md border rounded bg-white overflow-hidden">
                    <CourseImagePreview
                      imageUrl={getImageUrlWithCacheBusting(field.value)}
                      aspectRatio={aspectRatio}
                      imageSize={imageSize}
                      refreshKey={`${refreshKey}-${globalCacheBust}`}
                      handleRefreshImage={handleRefreshImage}
                    />
                    <CourseImageInfo
                      aspectRatio={aspectRatio}
                      imageSize={imageSize}
                      imageLayout={imageLayout}
                      globalCacheBust={globalCacheBust}
                      refreshKey={refreshKey}
                      onOpenMediaLibrary={onOpenMediaLibrary}
                    />
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

export default CourseImageField;
