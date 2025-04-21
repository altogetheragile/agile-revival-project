
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
import { X } from "lucide-react";

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

  const handleDeleteCategory = (value: string) => {
    setCustomCategories(customCategories.filter(cat => cat.value !== value));

    // If the deleted category was selected, reset to empty or first default
    if (form.getValues("category") === value) {
      form.setValue("category", defaultCategoryOptions[0]?.value ?? "");
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
                  <SelectContent>
                    {/* Default Categories */}
                    {defaultCategoryOptions.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                    
                    {customCategories.length > 0 && (
                      <>
                        {/* Add a visual separator before custom categories */}
                        <div className="py-1.5 px-2 text-xs font-semibold text-muted-foreground border-t">
                          Custom Categories
                        </div>
                        {/* Custom Categories with Delete Buttons */}
                        {customCategories.map(category => (
                          <div
                            key={category.value}
                            className="flex items-center justify-between px-2 py-1 hover:bg-accent rounded-sm"
                          >
                            <div 
                              className="flex-1 cursor-pointer min-w-0 px-2 py-1.5"
                              onClick={() => field.onChange(category.value)}
                            >
                              {category.label}
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteCategory(category.value);
                              }}
                              tabIndex={0}
                              aria-label={`Delete category ${category.label}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </>
                    )}
                    
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
