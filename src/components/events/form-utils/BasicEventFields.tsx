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
import { EventFormData } from "@/types/event";
import { CategorySelect } from "../../courses/form-utils/CategorySelect";
import { CategoryInput } from "../../courses/form-utils/CategoryInput";
import { EventTypeSelect } from "../../courses/form-utils/EventTypeSelect";
import { EventTypeInput } from "../../courses/form-utils/EventTypeInput";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { useEventTypeManagement } from "@/hooks/useEventTypeManagement";

interface BasicEventFieldsProps {
  form: UseFormReturn<EventFormData>;
}

export const BasicEventFields: React.FC<BasicEventFieldsProps> = ({ form }) => {
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
            <FormLabel>Event Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter event title" {...field} />
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
                placeholder="Enter event description" 
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
                    if (value === field.value) {
                      field.onChange(eventTypes[0]?.value || "");
                    }
                    
                    handleDeleteEventType(value, () => {});
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
                  categories={categories}
                  value={categories.find(cat => cat.value === field.value) || null}
                  onValueChange={(selectedCategory) => {
                    if (selectedCategory === null) {
                      setCategoryAddMode(true);
                    } else {
                      field.onChange(selectedCategory.value);
                    }
                  }}
                  onDelete={(value, e) => {
                    if (value === field.value) {
                      field.onChange(categories[0]?.value || "");
                    }
                    
                    handleDeleteCategory(value, () => {});
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
