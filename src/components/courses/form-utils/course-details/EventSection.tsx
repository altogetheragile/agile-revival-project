
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { EventTypeSelect } from "../EventTypeSelect";
import { CategorySelect } from "../CategorySelect";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";

interface EventSectionProps {
  form: UseFormReturn<CourseFormData>;
  eventTypes: { value: string; label: string }[];
  onEventTypeDelete: (value: string, e: React.MouseEvent) => void;
}

export const EventSection: React.FC<EventSectionProps> = ({ 
  form, 
  eventTypes, 
  onEventTypeDelete 
}) => {
  const { categories } = useCategoryManagement();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Event Type Select */}
      <FormField
        control={form.control}
        name="eventType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Type</FormLabel>
            <FormControl>
              <EventTypeSelect 
                eventTypes={eventTypes}
                value={field.value || ""} 
                onValueChange={field.onChange}
                onDelete={onEventTypeDelete}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Category Select */}
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <CategorySelect 
                categories={categories}
                value={field.value || ""} 
                onValueChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
