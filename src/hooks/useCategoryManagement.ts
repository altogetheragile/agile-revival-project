
import { useState, useEffect } from "react";
import { COURSE_CATEGORIES } from "@/constants/courseCategories";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/contexts/site-settings";

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();
  const { settings, updateSettings, refreshSettings } = useSiteSettings();

  // Initialize categories from site settings if available, otherwise use COURSE_CATEGORIES
  useEffect(() => {
    const initCategories = () => {
      if (settings.courseCategories && Array.isArray(settings.courseCategories)) {
        // Ensure we have the default "all" filter category excluded for editing purposes
        setCategories(
          settings.courseCategories
            .filter(cat => cat.value !== "all")
            .map(cat => ({
              value: cat.value,
              label: cat.label
            }))
        );
      } else {
        // Fallback to default categories
        setCategories(
          COURSE_CATEGORIES
            .filter(cat => cat.value !== "all")
            .map(cat => ({
              value: cat.value,
              label: cat.label
            }))
        );
      }
    };
    
    initCategories();
  }, [settings]);

  const saveCategoriesToSettings = async (updatedCategories: { value: string; label: string }[]) => {
    try {
      // Always include the "all" category for filtering purposes
      const allCategory = { value: "all", label: "All Courses" };
      const categoriesForSaving = [allCategory, ...updatedCategories];
      
      // Save to site settings
      await updateSettings('courseCategories', categoriesForSaving);
      
      // Update local state
      setCategories(updatedCategories);
      return true;
    } catch (error) {
      console.error("Error saving categories:", error);
      return false;
    }
  };

  const handleAddCategory = async (onAdd: (value: string) => void) => {
    if (
      newCategory.trim() &&
      !categories.some(opt => opt.value.toLowerCase() === newCategory.trim().toLowerCase())
    ) {
      const newCat = { value: newCategory.trim().toLowerCase(), label: newCategory.trim() };
      const updatedCategories = [...categories, newCat];
      
      const success = await saveCategoriesToSettings(updatedCategories);
      
      if (success) {
        onAdd(newCat.value);
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
    }
  };

  const handleDeleteCategory = async (value: string, onDelete: (value: string) => void) => {
    try {
      const updatedCategories = categories.filter(cat => cat.value !== value);
      const deletedCategory = categories.find(cat => cat.value === value);
      
      const success = await saveCategoriesToSettings(updatedCategories);
      
      if (success) {
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
