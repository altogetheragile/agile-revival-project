
import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { COURSE_CATEGORIES } from "@/constants/courseCategories";

interface CourseCategoryFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

export const CourseCategoryFields: React.FC<CourseCategoryFieldsProps> = ({ form }) => {
  // Do not show 'all' in the options
  const defaultCategoryOptions = COURSE_CATEGORIES.filter(cat => cat.value !== "all").map(cat => ({
    value: cat.value,
    label: cat.label
  }));

  // Track custom categories in state (session-local)
  const [customCategories, setCustomCategories] = useState<{ value: string, label: string }[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const allCategoryOptions = [...defaultCategoryOptions, ...customCategories];

  const handleAddCategory = () => {
    if (
      newCategory.trim() &&
      !allCategoryOptions.some(opt => opt.value.toLowerCase() === newCategory.trim().toLowerCase())
    ) {
      const newCat = { value: newCategory.trim().toLowerCase(), label: newCategory.trim() };
      setCustomCategories([...customCategories, newCat]);
      form.setValue("category", newCat.value); // Set this value on the form
      setAddMode(false);
      setNewCategory("");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            {addMode ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Type new category"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCategory();
                    } else if (e.key === "Escape") {
                      setAddMode(false);
                      setNewCategory("");
                    }
                  }}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim()}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setAddMode(false);
                    setNewCategory("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div>
                <Select
                  onValueChange={val => {
                    if (val === "__add_category__") {
                      setAddMode(true);
                      setTimeout(() => {
                        // Focus is handled automatically by Input
                      }, 0);
                    } else {
                      field.onChange(val);
                    }
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select or create a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allCategoryOptions.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                    <SelectItem
                      key="add-category"
                      value="__add_category__"
                      className="text-agile-purple cursor-pointer border-t border-muted"
                    >
                      + Add new category
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
