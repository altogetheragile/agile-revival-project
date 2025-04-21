
import { useState, useEffect } from "react";
import { COURSE_CATEGORIES } from "@/constants/courseCategories";
import { useToast } from "@/components/ui/use-toast";
import { useSiteSettings } from "@/contexts/site-settings";

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();
  const { settings, updateSettings } = useSiteSettings();

  // Initialize categories from site settings if available, otherwise use COURSE_CATEGORIES
  useEffect(() => {
    const initCategories = () => {
      try {
        if (settings?.courseCategories && Array.isArray(settings.courseCategories)) {
          // Ensure we exclude the "all" category from editing
          const editableCategories = settings.courseCategories
            .filter(cat => cat.value !== "all")
            .map(cat => ({
              value: cat.value,
              label: cat.label
            }));
          
          console.log("Setting categories from settings:", editableCategories);
          setCategories(editableCategories);
        } else {
          // Fallback to default categories
          const defaultCategories = COURSE_CATEGORIES
            .filter(cat => cat.value !== "all")
            .map(cat => ({
              value: cat.value,
              label: cat.label
            }));
          
          console.log("Setting default categories:", defaultCategories);
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error("Error initializing categories:", error);
        // Fallback to an empty array if there's an error
        setCategories([]);
      }
    };
    
    initCategories();
  }, [settings]);

  const saveCategoriesToSettings = async (updatedCategories: { value: string; label: string }[]) => {
    try {
      // Always include the "all" category for filtering purposes
      const allCategory = { value: "all", label: "All Courses" };
      const categoriesForSaving = [allCategory, ...updatedCategories];
      
      console.log("Saving categories to settings:", categoriesForSaving);
      
      // Save to site settings
      await updateSettings('courseCategories', categoriesForSaving);
      
      console.log("Categories saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving categories:", error);
      return false;
    }
  };

  const handleAddCategory = async (onAdd: (value: string) => void) => {
    console.log("Adding category:", newCategory);
    
    if (!newCategory || !newCategory.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const trimmedCategory = newCategory.trim();
    
    if (categories.some(opt => opt.value.toLowerCase() === trimmedCategory.toLowerCase() || 
                              opt.label.toLowerCase() === trimmedCategory.toLowerCase())) {
      toast({
        title: "Error",
        description: `"${trimmedCategory}" already exists as a category`,
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a value that's URL-friendly (lowercase, hyphens instead of spaces)
      const newCatValue = trimmedCategory.toLowerCase().replace(/\s+/g, '-');
      const newCat = { 
        value: newCatValue, 
        label: trimmedCategory 
      };
      
      console.log("New category object:", newCat);
      const updatedCategories = [...categories, newCat];
      
      const success = await saveCategoriesToSettings(updatedCategories);
      
      if (success) {
        console.log("Category added successfully:", newCat);
        setCategories(updatedCategories);
        
        // Call the callback with the new category value
        onAdd(newCat.value);
        
        // Reset state
        setAddMode(false);
        setNewCategory("");
        
        toast({
          title: "Category added",
          description: `"${newCat.label}" has been added to categories.`
        });
      } else {
        toast({
          title: "Error",
          description: "There was a problem adding the category.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in handleAddCategory:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (value: string, onDelete: (value: string) => void) => {
    try {
      console.log("Deleting category:", value);
      
      if (!value) {
        console.error("Invalid category value:", value);
        return;
      }
      
      const deletedCategory = categories.find(cat => cat.value === value);
      
      if (!deletedCategory) {
        console.error("Could not find category to delete:", value);
        return;
      }
      
      const updatedCategories = categories.filter(cat => cat.value !== value);
      
      const success = await saveCategoriesToSettings(updatedCategories);
      
      if (success) {
        console.log("Category deleted successfully");
        setCategories(updatedCategories); // Update local state
        onDelete(value);
        
        toast({
          title: "Category deleted",
          description: `"${deletedCategory?.label || value}" has been removed from categories.`
        });
      } else {
        toast({
          title: "Error",
          description: "There was a problem deleting the category.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "There was a problem deleting the category.",
        variant: "destructive"
      });
    }
  };

  return {
    categories,
    addMode,
    setAddMode,
    newCategory,
    setNewCategory,
    handleAddCategory,
    handleDeleteCategory
  };
};
