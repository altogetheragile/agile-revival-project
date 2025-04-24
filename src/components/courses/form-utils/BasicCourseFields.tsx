
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

interface BasicCourseFieldsProps {
  form: UseFormReturn<CourseFormData>;
  readOnly?: boolean;
  onOpenMediaLibrary?: () => void;
}

export const BasicCourseFields: React.FC<BasicCourseFieldsProps> = ({ 
  form, 
  readOnly = false,
  onOpenMediaLibrary
}) => {
  const handleImageButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenMediaLibrary) {
      onOpenMediaLibrary();
    }
  };

  // Get the current image URL from the form
  const imageUrl = form.watch("imageUrl");

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter course title" 
                {...field} 
                readOnly={readOnly}
                className={readOnly ? "bg-gray-100" : ""}
              />
            </FormControl>
            <FormDescription>
              The name of the course as it will appear to students.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter course description" 
                className={`min-h-32 ${readOnly ? "bg-gray-100" : ""}`}
                {...field} 
                readOnly={readOnly}
              />
            </FormControl>
            <FormDescription>
              A detailed description of what the course covers.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Image selector field */}
      {!readOnly && onOpenMediaLibrary && (
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Image</FormLabel>
              <div className="flex flex-col space-y-2">
                {imageUrl && (
                  <div className="relative w-full h-48 mb-2 overflow-hidden rounded-md border border-gray-300">
                    <img 
                      src={imageUrl} 
                      alt="Course preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleImageButtonClick}
                  className="flex items-center justify-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  {imageUrl ? "Change Image" : "Select Image"}
                </Button>
              </div>
              <FormDescription>
                Select an image for the course. Recommended size: 1200x630px.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
