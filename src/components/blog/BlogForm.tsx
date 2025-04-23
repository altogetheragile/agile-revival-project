
import React from "react";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BlogPostFormData } from "@/types/blog";
import MediaLibrary from "@/components/media/MediaLibrary";
import { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BlogFormProps {
  initialData?: BlogPostFormData;
  onSubmit: (data: BlogPostFormData) => void;
  onCancel: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ 
  initialData = { 
    title: "", 
    content: "", 
    url: "", 
    imageUrl: "", 
    imageAspectRatio: "16/9",
    imageSize: 100,
    imageLayout: "standard",
    isDraft: true 
  }, 
  onSubmit, 
  onCancel 
}) => {
  // Store complete form data separately to avoid losing fields
  const [formData, setFormData] = useState<BlogPostFormData>(initialData);
  const { toast } = useToast();
  
  // Initialize the form
  const form = useForm<BlogPostFormData>({
    defaultValues: formData
  });

  const [mediaLibOpen, setMediaLibOpen] = useState(false);

  // Reinitialize form when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("BlogForm initializing with data:", initialData);
      const newFormData = {
        ...initialData,
        // Set defaults for image settings if they don't exist
        imageAspectRatio: initialData.imageAspectRatio || "16/9",
        imageSize: initialData.imageSize || 100,
        imageLayout: initialData.imageLayout || "standard"
      };
      
      setFormData(newFormData);
      
      // Update all form fields
      Object.entries(newFormData).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: BlogPostFormData) => {
    // Merge form data with complete image settings
    const completeData = {
      ...data,
      imageUrl: data.imageUrl || formData.imageUrl,
      imageAspectRatio: data.imageAspectRatio || formData.imageAspectRatio || "16/9",
      imageSize: data.imageSize || formData.imageSize || 100,
      imageLayout: data.imageLayout || formData.imageLayout || "standard"
    };
    
    console.log("BlogForm submitting with data:", completeData);
    onSubmit(completeData);
  };

  const handleRemoveImage = () => {
    // Update both form and formData state
    form.setValue("imageUrl", "", { shouldValidate: true });
    form.setValue("imageAspectRatio", "16/9", { shouldValidate: false });
    form.setValue("imageSize", 100, { shouldValidate: false });
    form.setValue("imageLayout", "standard", { shouldValidate: false });
    
    setFormData({
      ...formData,
      imageUrl: "",
      imageAspectRatio: "16/9",
      imageSize: 100,
      imageLayout: "standard"
    });
    
    console.log("Image removed from blog post");
  };
  
  // Parse the aspect ratio string into a number
  const getAspectRatioValue = (ratio: string): number => {
    if (!ratio || ratio === "auto") return undefined as any; // Let the image use its natural ratio
    const [width, height] = ratio.split("/").map(Number);
    return width / height;
  };

  // Use form.watch to get current values
  const imageUrl = form.watch("imageUrl");
  const aspectRatio = form.watch("imageAspectRatio") || formData.imageAspectRatio || "16/9";
  const imageSize = form.watch("imageSize") || formData.imageSize || 100;
  const imageLayout = form.watch("imageLayout") || formData.imageLayout || "standard";

  // Handle media selection from library
  const handleMediaSelect = (url: string, aspectRatio?: string, size?: number, layout?: string) => {
    console.log("Blog media selected:", url, aspectRatio, size, layout);
    
    const updatedFormData = {
      ...formData,
      imageUrl: url,
      imageAspectRatio: aspectRatio || "16/9",
      imageSize: size || 100,
      imageLayout: layout || "standard"
    };
    
    // Update form values
    form.setValue("imageUrl", url, { shouldValidate: true });
    form.setValue("imageAspectRatio", aspectRatio || "16/9", { shouldValidate: false });
    form.setValue("imageSize", size || 100, { shouldValidate: false });
    form.setValue("imageLayout", layout || "standard", { shouldValidate: false });
    
    // Update state
    setFormData(updatedFormData);
    
    toast({
      title: "Image updated",
      description: "The image and its settings have been applied to the blog post."
    });
    
    console.log("Updated blog form data:", updatedFormData);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Blog post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content field */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Blog post content" 
                  className="min-h-[200px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* URL field */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/blog-post" {...field} />
              </FormControl>
              <FormDescription>
                Full URL to the blog post if hosted elsewhere
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image URL field with preview */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Image URL (Optional)
                <Button
                  className="ml-2"
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setMediaLibOpen(true)}
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
                          onClick={() => {
                            // Ensure we have the current form values when opening the media library
                            const currentImageUrl = form.getValues("imageUrl");
                            const currentAspectRatio = form.getValues("imageAspectRatio") || formData.imageAspectRatio || "16/9";
                            const currentImageSize = form.getValues("imageSize") || formData.imageSize || 100;
                            const currentImageLayout = form.getValues("imageLayout") || formData.imageLayout || "standard";
                            
                            console.log("Opening media library with current settings:", {
                              url: currentImageUrl,
                              aspectRatio: currentAspectRatio,
                              size: currentImageSize,
                              layout: currentImageLayout
                            });
                            
                            setMediaLibOpen(true);
                          }}
                        >
                          <Settings className="h-4 w-4" /> Adjust
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                URL to an image for the blog post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden fields to store image settings - these will be properly managed by formData state too */}
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

        {/* Media Library component */}
        <MediaLibrary
          open={mediaLibOpen}
          onOpenChange={(open) => {
            console.log("Media library open state changing to:", open);
            setMediaLibOpen(open);
          }}
          onSelect={handleMediaSelect}
        />

        {/* Draft checkbox */}
        <FormField
          control={form.control}
          name="isDraft"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-agile-purple"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Save as draft</FormLabel>
                <FormDescription>
                  Draft posts won't be displayed publicly
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Form action buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData?.id ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;
