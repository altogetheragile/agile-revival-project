
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
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

// Use a consistent type definition
interface Category {
  id?: string;
  value: string;
  label: string;
}

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  categories: Category[];
  className?: string;
  onDelete?: (value: string, e: React.MouseEvent) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onValueChange,
  categories,
  className,
}) => {
  const [open, setOpen] = useState(false);

  const currentCategory = categories.find((category) => category.value === value);

  const handleValueChange = (selectedValue: string) => {
    onValueChange(selectedValue);
    setOpen(false);
  };

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
            {value && currentCategory
              ? currentCategory.label
              : "Select category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800 border shadow-md z-50" align="start">
          <Command className="bg-white dark:bg-gray-800">
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => {
                  const isSelected = value === category.value;
                  
                  return (
                    <CommandItem
                      key={category.value}
                      value={category.value}
                      onSelect={() => {
                        // Use the category.value directly to avoid cmdk value transformation issues
                        handleValueChange(category.value);
                      }}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {category.label}
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
