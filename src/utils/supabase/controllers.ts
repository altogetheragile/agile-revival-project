
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from 'sonner';

/**
 * Check if the current user has admin role using the optimized check_user_role function
 * to avoid recursion issues with RLS policies
 */
export async function isUserAdmin(): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user) {
      return false;
    }
    
    // Use check_user_role with fully qualified references
    const { data, error } = await supabase.rpc('check_user_role', {
      user_id: userData.user.id,
      required_role: 'admin'
    });
    
    if (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Exception in isUserAdmin:", error);
    return false;
  }
}

/**
 * Check if the current user has a specific role using the optimized check_user_role function
 * to avoid recursion issues with RLS policies
 * 
 * @deprecated Use checkUserRole instead for consistency with database functions
 */
export async function hasRole(role: string): Promise<boolean> {
  console.warn("hasRole() is deprecated. Use checkUserRole() instead for consistency.");
  return await checkUserRole(role);
}

/**
 * Check if the current user has a specific role using the optimized check_user_role function
 * This is the preferred method to check roles as it matches the database function name
 */
export async function checkUserRole(role: string): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user) {
      return false;
    }
    
    // Use check_user_role directly with fully qualified references
    const { data, error } = await supabase.rpc('check_user_role', {
      user_id: userData.user.id,
      required_role: role
    });
    
    if (error) {
      console.error(`Error checking ${role} role:`, error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Exception in checkUserRole(${role}):`, error);
    return false;
  }
}
