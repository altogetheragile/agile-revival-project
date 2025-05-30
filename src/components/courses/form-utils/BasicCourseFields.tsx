
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
import { Skeleton } from "@/components/ui/skeleton";
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
  const {
    categories,
    addMode: categoryAddMode,
    setAddMode: setCategoryAddMode,
    newCategory,
    setNewCategory,
    handleAddCategory,
    handleDeleteCategory
  } = useCategoryManagement();

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
              {eventTypes.length === 0 ? (
                <Skeleton className="h-10 w-full" />
              ) : eventTypeAddMode ? (
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
              {categories.length === 0 ? (
                <Skeleton className="h-10 w-full" />
              ) : categoryAddMode ? (
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
