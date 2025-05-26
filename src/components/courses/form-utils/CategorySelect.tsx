import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

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
  onDelete
}) => {
  const [open, setOpen] = useState(false);

  const currentCategory = categories.find((cat) => cat.value === value) || null;

  if (!categories || categories.length === 0) {
    return (
      <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
    );
  }

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
            {currentCategory ? currentCategory.label : "Select category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 bg-white dark:bg-gray-800 border shadow-md z-50"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => {
                  const isSelected = value === category.value;
                  return (
                    <CommandItem
                      key={category.value}
                      onSelect={() => {
                        onValueChange(category.value);
                        setOpen(false);
                      }}
                      className="flex justify-between hover:bg-accent cursor-pointer"
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
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(category.value, e);
                          }}
                          className="text-sm text-red-600 hover:underline"
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
