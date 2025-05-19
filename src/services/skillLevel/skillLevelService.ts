
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SkillLevel {
  id: string;
  value: string;
  label: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all skill levels from the database
 */
export const getAllSkillLevels = async (): Promise<SkillLevel[]> => {
  try {
    const { data, error } = await supabase
      .from('skill_levels')
      .select('*')
      .order('label');

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching skill levels:", error);
    return [];
  }
};

/**
 * Get a skill level by its value
 */
export const getSkillLevelByValue = async (value: string): Promise<SkillLevel | null> => {
  try {
    const { data, error } = await supabase
      .from('skill_levels')
      .select('*')
      .eq('value', value)
      .single();

    if (error) {
      // Not found is not an error we need to report
      if (error.code !== 'PGRST116') {
        console.error(`Error getting skill level with value ${value}:`, error);
      }
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error getting skill level with value ${value}:`, error);
    return null;
  }
};

/**
 * Get a skill level by its ID
 */
export const getSkillLevelById = async (id: string): Promise<SkillLevel | null> => {
  try {
    const { data, error } = await supabase
      .from('skill_levels')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Not found is not an error we need to report
      if (error.code !== 'PGRST116') {
        console.error(`Error getting skill level with ID ${id}:`, error);
      }
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error getting skill level with ID ${id}:`, error);
    return null;
  }
};

/**
 * Create a new skill level
 */
export const createSkillLevel = async (skillLevel: Omit<SkillLevel, 'id' | 'created_at' | 'updated_at'>): Promise<SkillLevel | null> => {
  try {
    const { data, error } = await supabase
      .from('skill_levels')
      .insert(skillLevel)
      .select()
      .single();

    if (error) {
      console.error("Error creating skill level:", error);
      toast.error("Failed to create skill level", {
        description: error.message
      });
      return null;
    }

    toast.success("Skill level created");
    return data;
  } catch (error: any) {
    console.error("Error creating skill level:", error);
    toast.error("Failed to create skill level", {
      description: error?.message || "An unexpected error occurred"
    });
    return null;
  }
};

/**
 * Update an existing skill level
 */
export const updateSkillLevel = async (id: string, skillLevel: Partial<SkillLevel>): Promise<SkillLevel | null> => {
  try {
    const { data, error } = await supabase
      .from('skill_levels')
      .update(skillLevel)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating skill level:", error);
      toast.error("Failed to update skill level", {
        description: error.message
      });
      return null;
    }

    toast.success("Skill level updated");
    return data;
  } catch (error: any) {
    console.error("Error updating skill level:", error);
    toast.error("Failed to update skill level", {
      description: error?.message || "An unexpected error occurred"
    });
    return null;
  }
};

/**
 * Delete a skill level by ID
 */
export const deleteSkillLevel = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('skill_levels')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting skill level:", error);
      toast.error("Failed to delete skill level", {
        description: error.message
      });
      return false;
    }

    toast.success("Skill level deleted");
    return true;
  } catch (error: any) {
    console.error("Error deleting skill level:", error);
    toast.error("Failed to delete skill level", {
      description: error?.message || "An unexpected error occurred"
    });
    return false;
  }
};
