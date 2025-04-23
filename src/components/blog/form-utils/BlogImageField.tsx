
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BlogPostFormData } from "@/types/blog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Settings } from "lucide-react";

interface BlogImageFieldProps {
  form: UseFormReturn<BlogPostFormData>;
  onOpenMediaLibrary: () => void;
}

export const BlogImageField: React.FC<BlogImageFieldProps> = ({ form, onOpenMediaLibrary }) => {
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
      imageLayout
    });
  }, [form]);

  const handleRemoveImage = () => {
    console.log("Removing blog image");
    form.setValue("imageUrl", "", { shouldValidate: true });
    form.setValue("imageAspectRatio", "16/9", { shouldValidate: false });
    form.setValue("imageSize", 100, { shouldValidate: false });
    form.setValue("imageLayout", "standard", { shouldValidate: false });
  };

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
      imageLayout
    });
  }, [imageUrl, aspectRatio, imageSize, imageLayout]);
  
  // Parse the aspect ratio string into a number
  const getAspectRatioValue = (ratio: string): number => {
    if (ratio === "auto") return undefined as any;
    const [width, height] = ratio.split("/").map(Number);
    return width / height;
  };

  // Render image based on layout and settings
  const renderImage = () => {
    if (!imageUrl) return null;
    
    const imageStyle = {
      width: `${imageSize}%`,
      maxWidth: '100%',
    };

    return (
      <div className="w-full" style={imageStyle}>
        {aspectRatio === "auto" ? (
          <img 
            src={imageUrl}
            alt="Preview"
            className="w-full object-contain"
          />
        ) : (
          <AspectRatio ratio={getAspectRatioValue(aspectRatio)}>
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
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
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="ml-2 text-red-500 border-red-200"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </Button>
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
