
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

  console.log("=== CategorySelect Debug ===");
  console.log("CategorySelect: Received categories prop:", categories);
  console.log("CategorySelect: Current value prop:", value);
  console.log("CategorySelect: Popover open state:", open);

  const currentCategory = categories.find((category) => category.value === value);

  console.log("CategorySelect: Current category found:", currentCategory);

  const handleValueChange = (selectedValue: string) => {
    console.log("=== Selection Handler Debug ===");
    console.log("CategorySelect: handleValueChange called with:", selectedValue);
    console.log("CategorySelect: Previous value was:", value);
    console.log("CategorySelect: About to call onValueChange with:", selectedValue);
    
    onValueChange(selectedValue);
    setOpen(false);
    
    console.log("CategorySelect: onValueChange called, popover should close");
  };

  const handleItemSelect = (selectedValue: string) => {
    console.log("=== CommandItem onSelect Debug ===");
    console.log("CommandItem: onSelect triggered with value:", selectedValue);
    console.log("CommandItem: Comparing with current value:", value);
    console.log("CommandItem: Are they equal?", selectedValue === value);
    
    // Call the main handler
    handleValueChange(selectedValue);
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
                  console.log(`Category "${category.label}" (${category.value}): selected=${isSelected}`);
                  
                  return (
                    <CommandItem
                      key={category.value}
                      value={category.value}
                      onSelect={(currentValue) => {
                        console.log("=== CommandItem Raw onSelect ===");
                        console.log("Raw currentValue from cmdk:", currentValue);
                        console.log("Expected category.value:", category.value);
                        console.log("Direct match?", currentValue === category.value);
                        
                        // Use the category.value directly instead of currentValue
                        // This bypasses any potential cmdk value transformation
                        handleItemSelect(category.value);
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
