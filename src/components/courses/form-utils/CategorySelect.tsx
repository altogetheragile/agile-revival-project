
import React from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface Category {
  id?: string;
  value: string;
  label: string;
}

interface CategorySelectProps {
  categories: Category[];
  value: Category | null;
  onValueChange: (selectedCategory: Category | null) => void;
  onDelete?: (value: string, e: React.MouseEvent) => void;
  className?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  value,
  onValueChange,
  onDelete,
  className
}) => {
  const handleChange = (newValue: string) => {
    if (newValue === "__add_category__") {
      onValueChange(null);
    } else {
      const selectedCategory = categories.find(cat => cat.value === newValue);
      onValueChange(selectedCategory || null);
    }
  };

  return (
    <Select
      onValueChange={handleChange}
      value={value?.value || ""}
      defaultValue={value?.value || ""}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select or create a category" />
      </SelectTrigger>
      <SelectContent className="min-w-[200px] z-[100]">
        {categories.map(category => (
          <div
            key={category.id || category.value}
            className="flex items-center justify-between px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer group relative"
          >
            <SelectItem
              value={category.value}
              className="flex-1 cursor-pointer"
            >
              {category.label}
            </SelectItem>
            {onDelete && (
              <button
                type="button"
                className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600"
                onClick={e => {
                  e.preventDefault(); 
                  e.stopPropagation();
                  onDelete(category.value, e);
                }}
                aria-label={`Delete category ${category.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        <SelectItem
          key="add-category"
          value="__add_category__"
          className="text-blue-600 cursor-pointer border-t border-muted"
        >
          + Add new category
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
