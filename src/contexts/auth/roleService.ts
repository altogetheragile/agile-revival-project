
import { supabase } from "@/integrations/supabase/client";
import { Role } from "./types";

export const fetchUserRole = async (userId: string): Promise<Role> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (error) throw error;
    
    return data ? 'admin' : 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user'; // Default to 'user' role on error
  }
};
