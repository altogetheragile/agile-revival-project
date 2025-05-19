
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Category {
  id: string;
  value: string;
  label: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all categories from the database
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('label');

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

/**
 * Get a category by its value
 */
export const getCategoryByValue = async (value: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('value', value)
      .single();

    if (error) {
      // Not found is not an error we need to report
      if (error.code !== 'PGRST116') {
        console.error(`Error getting category with value ${value}:`, error);
      }
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error getting category with value ${value}:`, error);
    return null;
  }
};

/**
 * Get a category by its ID
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Not found is not an error we need to report
      if (error.code !== 'PGRST116') {
        console.error(`Error getting category with ID ${id}:`, error);
      }
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error getting category with ID ${id}:`, error);
    return null;
  }
};

/**
 * Create a new category
 */
export const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category", {
        description: error.message
      });
      return null;
    }

    toast.success("Category created");
    return data;
  } catch (error: any) {
    console.error("Error creating category:", error);
    toast.error("Failed to create category", {
      description: error?.message || "An unexpected error occurred"
    });
    return null;
  }
};

/**
 * Update an existing category
 */
export const updateCategory = async (id: string, category: Partial<Category>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category", {
        description: error.message
      });
      return null;
    }

    toast.success("Category updated");
    return data;
  } catch (error: any) {
    console.error("Error updating category:", error);
    toast.error("Failed to update category", {
      description: error?.message || "An unexpected error occurred"
    });
    return null;
  }
};

/**
 * Delete a category by ID
 */
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category", {
        description: error.message
      });
      return false;
    }

    toast.success("Category deleted");
    return true;
  } catch (error: any) {
    console.error("Error deleting category:", error);
    toast.error("Failed to delete category", {
      description: error?.message || "An unexpected error occurred"
    });
    return false;
  }
};
