// components/CourseForm/CategorySelect.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id?: string;
  value: string;
  label: string;
}

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onValueChange: (value: string) => void;
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
  const currentCategory = categories.find(cat => cat.value === value);

  return (
    <div className={cn("relative", className)}>
      <select
        className="w-full h-10 border rounded-md px-3 bg-white dark:bg-gray-800"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        <option value="">Select category...</option>
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>

      {onDelete && value && currentCategory && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={(e) => onDelete(value, e)}
          className="absolute right-2 top-1.5 text-red-500"
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
