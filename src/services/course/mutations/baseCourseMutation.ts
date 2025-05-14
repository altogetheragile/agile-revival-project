
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { executeQuery } from "@/utils/supabase/query";
import { User } from "@supabase/supabase-js";

// Interface for authentication data response matching the actual structure
export interface UserData {
  user: User | null;
}

// Shared utility for getting authenticated user
export const getAuthenticatedUser = async (): Promise<User | null> => {
  const { data: authData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !authData?.user) {
    console.error("User not authenticated or error getting user:", userError);
    toast.error("Authentication required", {
      description: "You must be logged in to perform this action."
    });
    return null;
  }
  
  return authData.user;
};

// Utility to check if user has admin role
export const checkAdminRole = async (userId: string): Promise<boolean> => {
  const { data: isAdmin, error: roleError } = await executeQuery<boolean>(
    async () => await supabase.rpc('check_user_role', {
      user_id: userId,
      required_role: 'admin'
    }),
    {
      timeoutMs: 20000,
      showErrorToast: true,
      errorMessage: "Permission check failed",
      retries: 2
    }
  );

  if (roleError) {
    console.error("Error checking admin role:", roleError);
    toast.error("Permission check failed", {
      description: "Unable to verify admin permissions."
    });
    return false;
  }

  if (!isAdmin) {
    console.error("User lacks admin role:", userId);
    toast.error("Access denied", {
      description: "Admin privileges required for this action."
    });
    return false;
  }

  return true;
};

// Handles standard error messaging
export const handleMutationError = (error: any, defaultMessage: string): void => {
  console.error(`Error in course mutation: ${defaultMessage}`, error);
  
  // Enhanced error messaging
  let errorMessage = defaultMessage;
  if (error.message?.includes('violates row-level security policy')) {
    errorMessage = "Permission issue: You don't have the required permissions";
  } else if (error.message?.includes('timed out') || error.message?.includes('connection')) {
    errorMessage = "Database connection issue: Please try again";
  }
  
  toast.error(defaultMessage, {
    description: error instanceof Error ? errorMessage : "Unknown error occurred"
  });
};
