
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { CategoryInput } from "./CategoryInput";
import { CategorySelect } from "./CategorySelect";

interface CourseCategoryFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

export const CourseCategoryFields: React.FC<CourseCategoryFieldsProps> = ({ form }) => {
  const {
    categories,
    addMode,
    setAddMode,
    newCategory,
    setNewCategory,
    handleAddCategory,
    handleDeleteCategory
  } = useCategoryManagement();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            {addMode ? (
              <CategoryInput
                value={newCategory}
                onChange={setNewCategory}
                onAdd={() => handleAddCategory((value) => field.onChange(value))}
                onCancel={() => {
                  setAddMode(false);
                  setNewCategory("");
                }}
              />
            ) : (
              <FormControl>
                <CategorySelect
                  categories={categories}
                  value={field.value}
                  onValueChange={(val) => {
                    if (val === "__add_category__") {
                      setAddMode(true);
                    } else {
                      field.onChange(val);
                    }
                  }}
                  onDelete={(value, e) => {
                    handleDeleteCategory(value, (deletedValue) => {
                      if (field.value === deletedValue) {
                        field.onChange(categories[0]?.value ?? "");
                      }
                    });
                  }}
                />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField 
        control={form.control}
        name="spotsAvailable"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Available Spots</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                {...field}
                onChange={e => field.onChange(e.target.valueAsNumber || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
