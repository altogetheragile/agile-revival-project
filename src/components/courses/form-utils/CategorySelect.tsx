
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
  value: string;
  label: string;
}

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onValueChange: (value: string) => void;
  onDelete: (value: string, e: React.MouseEvent) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  value,
  onValueChange,
  onDelete
}) => {
  // Handle delete without event bubbling issues
  const handleDelete = (categoryValue: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(categoryValue, e);
  };

  return (
    <Select
      onValueChange={val => {
        if (val === "__add_category__") {
          return;
        }
        onValueChange(val);
      }}
      value={value}
      defaultValue={value}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select or create a category" />
      </SelectTrigger>
      <SelectContent className="min-w-[200px] z-[100] bg-white">
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
              onClick={(e) => handleDelete(category.value, e)}
              aria-label={`Delete category ${category.label}`}
            >
              <X className="h-3 w-3" />
            </button>
          </SelectItem>
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
