
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EventFormData } from "@/types/event";

interface EventImageFieldProps {
  form: UseFormReturn<EventFormData>;
  onOpenMediaLibrary?: () => void;
}

export const EventImageField: React.FC<EventImageFieldProps> = ({ form, onOpenMediaLibrary }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Event Image</h3>
      
      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image</FormLabel>
            <div className="flex items-center gap-2">
              <FormControl>
                <Input {...field} placeholder="Image URL" />
              </FormControl>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onOpenMediaLibrary}
                className="shrink-0"
              >
                <Image className="h-4 w-4 mr-1" /> Select
              </Button>
            </div>
            {field.value && (
              <div className="mt-2 border rounded-md p-2 max-w-xs">
                <img 
                  src={field.value} 
                  alt="Event preview" 
                  className="w-full h-auto rounded-md"
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
