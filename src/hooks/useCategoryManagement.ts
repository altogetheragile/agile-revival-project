
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getAllCategories, createCategory, deleteCategory, Category } from "@/services/category/categoryService";

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();

  // Load categories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log("useCategoryManagement: Loading categories from database...");
        const data = await getAllCategories();
        console.log("useCategoryManagement: Loaded categories:", data);
        
        // Transform database categories to the format expected by the hook
        const transformedCategories = data.map(cat => ({
          value: cat.value,
          label: cat.label
        }));
        
        setCategories(transformedCategories);
      } catch (error) {
        console.error("useCategoryManagement: Error loading categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories from database",
          variant: "destructive"
        });
      }
    };
    
    loadCategories();
  }, [toast]);

  const handleAddCategory = async (onAdd: (value: string) => void) => {
    if (
      newCategory.trim() &&
      !categories.some(opt => opt.value.toLowerCase() === newCategory.trim().toLowerCase())
    ) {
      try {
        const newCat = { 
          value: newCategory.trim().toLowerCase(), 
          label: newCategory.trim() 
        };
        
        console.log("useCategoryManagement: Creating new category:", newCat);
        
        // Create category in database
        const createdCategory = await createCategory(newCat);
        
        if (createdCategory) {
          // Update local state
          const updatedCategories = [...categories, newCat];
          setCategories(updatedCategories);
          
          onAdd(newCat.value);
          setAddMode(false);
          setNewCategory("");
          
          toast({
            title: "Category added",
            description: `"${newCat.label}" has been added to categories.`
          });
        }
      } catch (error) {
        console.error("useCategoryManagement: Error creating category:", error);
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
      console.log("useCategoryManagement: Deleting category:", value);
      
      // Find the category to get its ID
      const allCategories = await getAllCategories();
      const categoryToDelete = allCategories.find(cat => cat.value === value);
      
      if (categoryToDelete) {
        const success = await deleteCategory(categoryToDelete.id);
        
        if (success) {
          // Update local state
          const updatedCategories = categories.filter(cat => cat.value !== value);
          const deletedCategory = categories.find(cat => cat.value === value);
          
          setCategories(updatedCategories);
          onDelete(value);
          
          toast({
            title: "Category deleted",
            description: `"${deletedCategory?.label || value}" has been removed from categories.`
          });
        }
      }
    } catch (error) {
      console.error("useCategoryManagement: Error deleting category:", error);
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
