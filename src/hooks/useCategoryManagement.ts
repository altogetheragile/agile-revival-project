
import { useState, useEffect } from "react";
import { COURSE_CATEGORIES } from "@/constants/courseCategories";
import { useToast } from "@/components/ui/use-toast";

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();

  // Initialize categories from COURSE_CATEGORIES (excluding "all")
  useEffect(() => {
    setCategories(
      COURSE_CATEGORIES
        .filter(cat => cat.value !== "all")
        .map(cat => ({
          value: cat.value,
          label: cat.label
        }))
    );
  }, []);

  const handleAddCategory = (onAdd: (value: string) => void) => {
    if (
      newCategory.trim() &&
      !categories.some(opt => opt.value.toLowerCase() === newCategory.trim().toLowerCase())
    ) {
      const newCat = { value: newCategory.trim().toLowerCase(), label: newCategory.trim() };
      setCategories([...categories, newCat]);
      onAdd(newCat.value);
      setAddMode(false);
      setNewCategory("");
      
      toast({
        title: "Category added",
        description: `"${newCat.label}" has been added to categories.`
      });
    }
  };

  const handleDeleteCategory = (value: string, onDelete: (value: string) => void) => {
    try {
      const updatedCategories = categories.filter(cat => cat.value !== value);
      const deletedCategory = categories.find(cat => cat.value === value);
      setCategories(updatedCategories);
      onDelete(value);
      
      toast({
        title: "Category deleted",
        description: `"${deletedCategory?.label || value}" has been removed from categories.`
      });
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
