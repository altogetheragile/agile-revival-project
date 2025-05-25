
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { CategorySelect } from "./CategorySelect";
import { CategoryInput } from "./CategoryInput";
import { EventTypeSelect } from "./EventTypeSelect";
import { EventTypeInput } from "./EventTypeInput";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { useEventTypeManagement } from "@/hooks/useEventTypeManagement";

interface BasicCourseFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

export const BasicCourseFields: React.FC<BasicCourseFieldsProps> = ({ form }) => {
  // Category management
  const {
    categories,
    addMode: categoryAddMode,
    setAddMode: setCategoryAddMode,
    newCategory,
    setNewCategory,
    handleAddCategory,
    handleDeleteCategory
  } = useCategoryManagement();

  // Event type management
  const {
    eventTypes,
    addMode: eventTypeAddMode,
    setAddMode: setEventTypeAddMode,
    newEventType,
    setNewEventType,
    handleAddEventType,
    handleDeleteEventType
  } = useEventTypeManagement();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <FormField
        control={form.control}
        name="title"
        rules={{ required: "Title is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter course title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        rules={{ required: "Description is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter course description" 
                className="h-24"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="eventType"
        rules={{ required: "Event type is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Type</FormLabel>
            <FormControl>
              {eventTypeAddMode ? (
                <EventTypeInput
                  value={newEventType}
                  onChange={setNewEventType}
                  onAdd={() => handleAddEventType((value) => {
                    field.onChange(value);
                    setEventTypeAddMode(false);
                  })}
                  onCancel={() => setEventTypeAddMode(false)}
                />
              ) : (
                <EventTypeSelect
                  eventTypes={eventTypes}
                  value={field.value || ""}
                  onValueChange={(value) => {
                    if (value === "__add_event_type__") {
                      setEventTypeAddMode(true);
                    } else {
                      field.onChange(value);
                    }
                  }}
                  onDelete={(value, e) => {
                    // If the current value is being deleted, reset to a default
                    if (value === field.value) {
                      field.onChange(eventTypes[0]?.value || "");
                    }
                    
                    handleDeleteEventType(value, () => {
                      // This callback is called when deletion is successful
                    });
                  }}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="category"
        rules={{ required: "Category is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              {categoryAddMode ? (
                <CategoryInput
                  value={newCategory}
                  onChange={setNewCategory}
                  onAdd={() => handleAddCategory((value) => {
                    field.onChange(value);
                    setCategoryAddMode(false);
                  })}
                  onCancel={() => setCategoryAddMode(false)}
                />
              ) : (
                <CategorySelect
                  value={field.value || ""}
                  onValueChange={(value) => {
                    if (value === "__add_category__") {
                      setCategoryAddMode(true);
                    } else {
                      field.onChange(value);
                    }
                  }}
                  onDelete={(value, e) => {
                    // If the current value is being deleted, reset to a default
                    if (value === field.value) {
                      field.onChange(categories[0]?.value || "");
                    }
                    
                    handleDeleteCategory(value, () => {
                      // This callback is called when deletion is successful
                    });
                  }}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
