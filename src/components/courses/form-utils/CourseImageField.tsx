
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";

interface CourseImageFieldProps {
  form: UseFormReturn<CourseFormData>;
  onOpenMediaLibrary: () => void;
}

export const CourseImageField: React.FC<CourseImageFieldProps> = ({ form, onOpenMediaLibrary }) => {
  return (
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
          </FormLabel>
          <FormControl>
            <div className="flex flex-col gap-2">
              <Input placeholder="https://example.com/image.jpg" {...field} />
              {field.value && (
                <img
                  src={field.value}
                  alt="Preview"
                  className="mt-2 w-36 h-20 object-contain border rounded bg-white"
                />
              )}
            </div>
          </FormControl>
          <FormDescription>
            This image will be shown in course details and listings.
          </FormDescription>
          {/* Do not show FormMessage here to avoid clutter */}
        </FormItem>
      )}
    />
  );
};
