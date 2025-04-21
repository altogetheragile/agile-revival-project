
import React, { useState, useEffect } from "react";
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
import { X } from "lucide-react";

interface CourseCategoryFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

export const CourseCategoryFields: React.FC<CourseCategoryFieldsProps> = ({ form }) => {
  // Track all categories in a single state array
  const [categories, setCategories] = useState<{ value: string, label: string }[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Initialize categories from COURSE_CATEGORIES (excluding "all")
  useEffect(() => {
    setCategories(
      COURSE_CATEGORIES
        .filter(cat => cat.value !== "all")
        .map(cat => ({
          value: cat.value,
          label: cat.label
        }))
    );
  }, []);

  const handleAddCategory = () => {
    if (
      newCategory.trim() &&
      !categories.some(opt => opt.value.toLowerCase() === newCategory.trim().toLowerCase())
    ) {
      const newCat = { value: newCategory.trim().toLowerCase(), label: newCategory.trim() };
      setCategories([...categories, newCat]);
      form.setValue("category", newCat.value);
      setAddMode(false);
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (value: string, e: React.MouseEvent) => {
    console.log("Deleting category:", value);
    
    // Make sure to stop event propagation immediately
    e.stopPropagation();
    e.preventDefault();
    
    // Filter out the category to be deleted
    const updatedCategories = categories.filter(cat => cat.value !== value);
    setCategories(updatedCategories);

    // If the deleted category was selected, reset to empty or first available
    if (form.getValues("category") === value) {
      form.setValue("category", updatedCategories[0]?.value ?? "");
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
                    } else {
                      field.onChange(val);
                    }
                  }}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select or create a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="min-w-[200px] z-[100] bg-white">
                    {/* All Categories */}
                    {categories.map(category => (
                      <SelectItem 
                        key={category.value} 
                        value={category.value} 
                        className="flex justify-between items-center group pr-8 relative"
                      >
                        <span className="truncate">{category.label}</span>
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 z-[200]"
                          onClick={(e) => handleDeleteCategory(category.value, e)}
                          aria-label={`Delete category ${category.label}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </SelectItem>
                    ))}

                    {/* Add New Category Option */}
                    <SelectItem
                      key="add-category"
                      value="__add_category__"
                      className="text-blue-600 cursor-pointer border-t border-muted"
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
