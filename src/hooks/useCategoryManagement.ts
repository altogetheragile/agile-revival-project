
import { useState, useEffect } from "react";
import { COURSE_CATEGORIES } from "@/constants/courseCategories";

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newCategory, setNewCategory] = useState("");

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
    }
  };

  const handleDeleteCategory = (value: string, onDelete: (value: string) => void) => {
    const updatedCategories = categories.filter(cat => cat.value !== value);
    setCategories(updatedCategories);
    onDelete(value);
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
