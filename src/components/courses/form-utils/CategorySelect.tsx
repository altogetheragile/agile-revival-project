
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
  // Safe handling of categories to prevent rendering issues
  const safeCategories = Array.isArray(categories) ? categories : [];
  
  return (
    <Select
      value={value}
      onValueChange={(val) => {
        console.log("CategorySelect - onValueChange with:", val);
        onValueChange(val);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select or create a category" />
      </SelectTrigger>
      <SelectContent className="min-w-[200px] z-[100]">
        {safeCategories.map(category => (
          <div 
            key={category.value} 
            className="flex items-center justify-between px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer"
          >
            <SelectItem 
              value={category.value} 
              className="flex-1 cursor-pointer"
            >
              {category.label}
            </SelectItem>
            <button
              type="button"
              className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(category.value, e);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <SelectItem
          key="__add_category__"
          value="__add_category__"
          className="text-blue-600 cursor-pointer border-t border-muted"
        >
          + Add new category
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
