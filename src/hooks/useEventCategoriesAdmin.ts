
import { useState, useEffect } from "react";
import { Category, getAllCategories, createCategory, updateCategory, deleteCategory } from "@/services/category/categoryService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NewCategory {
  label: string;
  value: string;
}

export const useEventCategoriesAdmin = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<NewCategory>({ label: "", value: "" });

  // Load categories and usage counts
  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, countsData] = await Promise.all([
        getAllCategories(),
        getCategoryUsageCounts()
      ]);
      
      setCategories(categoriesData);
      setUsageCounts(countsData);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  // Get usage counts for categories
  const getCategoryUsageCounts = async (): Promise<Record<string, number>> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('category_id')
        .not('category_id', 'is', null)
        .is('deleted_at', null); // Only count non-deleted courses

      if (error) {
        console.error("Error fetching category usage:", error);
        return {};
      }

      // Count occurrences of each category_id
      const counts: Record<string, number> = {};
      data?.forEach(course => {
        if (course.category_id) {
          counts[course.category_id] = (counts[course.category_id] || 0) + 1;
        }
      });

      return counts;
    } catch (error) {
      console.error("Failed to fetch category usage counts:", error);
      return {};
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleStartEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setEditingCategory(updatedCategory);
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;

    const updated = await updateCategory(editingCategory.id!, {
      label: editingCategory.label,
      value: editingCategory.value
    });

    if (updated) {
      await loadCategories();
      setEditingCategory(null);
      toast.success("Category updated successfully");
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleAddCategory = async () => {
    if (!newCategory.label || !newCategory.value) {
      toast.error("Please provide both label and value");
      return;
    }

    const created = await createCategory({
      label: newCategory.label,
      value: newCategory.value
    });

    if (created) {
      await loadCategories();
      setNewCategory({ label: "", value: "" });
      setIsAddingNew(false);
      toast.success("Category created successfully");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const usageCount = usageCounts[categoryId] || 0;
    
    if (usageCount > 0) {
      toast.error("Cannot delete category", {
        description: `This category is currently used by ${usageCount} course(s)`
      });
      return;
    }

    const success = await deleteCategory(categoryId);
    if (success) {
      await loadCategories();
      toast.success("Category deleted successfully");
    }
  };

  return {
    categories,
    usageCounts,
    isLoading,
    isAddingNew,
    editingCategory,
    newCategory,
    setNewCategory,
    setIsAddingNew,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleUpdateCategory,
    handleAddCategory,
    handleDeleteCategory
  };
};
