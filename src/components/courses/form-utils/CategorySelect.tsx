
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getAllCategories, createCategory } from "@/services/category/categoryService";

// Use a consistent type definition
interface Category {
  id?: string;
  value: string;
  label: string;
}

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  categories?: Category[];
  className?: string;
  onDelete?: (value: string, e: React.MouseEvent) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onValueChange,
  categories: propCategories,
  className,
  onDelete
}) => {
  const [open, setOpen] = useState(false);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load categories from props or fetch them
  useEffect(() => {
    if (propCategories) {
      console.log("CategorySelect: Using prop categories:", propCategories);
      setCategories(propCategories);
    } else {
      console.log("CategorySelect: No prop categories, fetching from API");
      fetchCategories();
    }
  }, [propCategories]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      console.log("CategorySelect: Fetching categories...");
      const data = await getAllCategories();
      console.log("CategorySelect: Fetched categories:", data);
      
      // Ensure each category has an id property
      const categoriesWithId = data.map(cat => ({
        ...cat,
        id: cat.id || cat.value
      }));
      
      console.log("CategorySelect: Categories with ID:", categoriesWithId);
      setCategories(categoriesWithId);
    } catch (error) {
      console.error("CategorySelect: Failed to fetch categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewCategory = async () => {
    if (!newLabel.trim() || !newValue.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a label and a value",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const category = await createCategory({
        label: newLabel.trim(),
        value: newValue.trim().toLowerCase()
      });
      
      if (category) {
        toast({
          title: "Success",
          description: "New category created"
        });
        setNewCategoryOpen(false);
        await fetchCategories(); // Refresh categories
        onValueChange(category.value);
        
        // Reset form
        setNewLabel("");
        setNewValue("");
      }
    } catch (error) {
      console.error("Failed to create category:", error);
      toast({
        title: "Error",
        description: "Failed to create new category",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = categories.find((category) => category.value === value);

  console.log("CategorySelect: Current value:", value);
  console.log("CategorySelect: Available categories:", categories);
  console.log("CategorySelect: Current category:", currentCategory);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {value && currentCategory
              ? currentCategory.label
              : loading
              ? "Loading categories..."
              : "Select category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800 border shadow-md z-50" align="start">
          <Command className="bg-white dark:bg-gray-800">
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>
                {loading ? "Loading categories..." : "No category found."}
              </CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id || category.value}
                    value={category.value}
                    onSelect={(currentValue) => {
                      console.log("CategorySelect: Selected value:", currentValue);
                      onValueChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === category.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {category.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setNewCategoryOpen(true);
                  }}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create new category
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={newCategoryOpen} onOpenChange={setNewCategoryOpen}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Add new category</DialogTitle>
            <DialogDescription>
              Create a new course category
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">
                Display Label
              </Label>
              <Input
                id="label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g., User Experience"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value ID
              </Label>
              <Input
                id="value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="e.g., ux-design"
                className="col-span-3"
              />
              <p className="text-xs text-muted-foreground col-start-2 col-span-3">
                This is used internally and in URLs. Use lowercase with hyphens.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewCategoryOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleNewCategory} disabled={loading}>
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
