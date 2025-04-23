
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CourseImageFieldProps {
  form: UseFormReturn<CourseFormData>;
  onOpenMediaLibrary: () => void;
}

export const CourseImageField: React.FC<CourseImageFieldProps> = ({ form, onOpenMediaLibrary }) => {
  const handleRemoveImage = () => {
    form.setValue("imageUrl", "", { shouldValidate: true });
    // Also clear the aspect ratio when removing the image
    form.setValue("imageAspectRatio", undefined, { shouldValidate: false });
  };

  const imageUrl = form.watch("imageUrl");
  const aspectRatio = form.watch("imageAspectRatio") || "16/9";
  
  // Parse the aspect ratio string into a number
  const getAspectRatioValue = (ratio: string): number => {
    if (ratio === "auto") return undefined as any; // Let the image use its natural ratio
    const [width, height] = ratio.split("/").map(Number);
    return width / height;
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
                    {aspectRatio === "auto" ? (
                      <img 
                        src={field.value}
                        alt="Preview"
                        className="w-full object-contain"
                      />
                    ) : (
                      <AspectRatio ratio={getAspectRatioValue(aspectRatio)}>
                        <img
                          src={field.value}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    )}
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              This image will be shown in course details and listings.
            </FormDescription>
          </FormItem>
        )}
      />
      
      {/* Hidden field to store the aspect ratio */}
      <FormField
        control={form.control}
        name="imageAspectRatio"
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />
    </>
  );
};
