// components/CourseForm/CategorySelect.tsx
import React, { useState } from "react";
import { Check, ChevronsUpDown, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  className,
}) => {
  const [open, setOpen] = useState(false);
  const selectedCategory = categories.find((cat) => cat.value === value);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCategory?.label || "Select category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => {
                  const isSelected = category.value === value;
                  return (
                    <CommandItem
                      key={category.value}
                      onSelect={() => {
                        onValueChange(category.value);
                        setOpen(false);
                      }}
                      className="flex justify-between"
                    >
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {category.label}
                      </div>
                      {onDelete && (
                        <button
                          className="text-red-500 text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(category.value, e);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
