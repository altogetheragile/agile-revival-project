
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { executeQuery } from "@/utils/supabase/query";
import { User } from "@supabase/supabase-js";
import { useDevMode } from "@/contexts/DevModeContext";

// Interface for authentication data response matching the actual structure
export interface UserData {
  user: User | null;
}

// Check if Dev Mode is active
const isDevModeActive = (): boolean => {
  // We can't use the React hook directly here, so we'll check localStorage
  try {
    return localStorage.getItem('devModeEnabled') === 'true';
  } catch (e) {
    console.error("Error checking Dev Mode status:", e);
    return false;
  }
};

// Shared utility for getting authenticated user
export const getAuthenticatedUser = async (): Promise<User | null> => {
  try {
    // In Dev Mode, return a mock user with admin privileges
    if (isDevModeActive()) {
      console.log("[Dev Mode] Bypassing authentication check, returning mock admin user");
      return {
        id: "00000000-0000-0000-0000-000000000000",
        email: "dev@example.com",
        role: "authenticated",
        app_metadata: { provider: "dev_mode" },
        user_metadata: { name: "Dev Mode User" },
        aud: "authenticated",
        created_at: new Date().toISOString()
      } as unknown as User;
    }
    
    const { data: authData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Error getting authenticated user:", userError);
      toast.error("Authentication required", {
        description: "You must be logged in to perform this action."
      });
      return null;
    }
    
    if (!authData?.user) {
      console.error("No authenticated user found");
      toast.error("Authentication required", {
        description: "You must be logged in to perform this action."
      });
      return null;
    }
    
    return authData.user;
  } catch (err) {
    console.error("Exception in getAuthenticatedUser:", err);
    toast.error("Authentication error", {
      description: "Failed to verify authentication status."
    });
    return null;
  }
};

// Utility to check if user has admin role
export const checkAdminRole = async (userId: string): Promise<boolean> => {
  try {
    // In Dev Mode, always return true for admin role
    if (isDevModeActive()) {
      console.log("[Dev Mode] Bypassing admin role check, granting admin privileges");
      return true;
    }
    
    // Direct RPC call to the fixed database function
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
  } catch (err) {
    console.error("Exception checking admin role:", err);
    toast.error("Permission check failed", {
      description: "Unable to verify admin permissions due to an error."
    });
    return false;
  }
};

// Handles standard error messaging
export const handleMutationError = (error: any, defaultMessage: string): void => {
  console.error(`Error in course mutation: ${defaultMessage}`, error);
  
  // Enhanced error messaging
  let errorMessage = defaultMessage;
  let errorDescription = "";
  
  if (error?.message) {
    if (error.message.includes('violates row-level security policy')) {
      errorMessage = "Permission issue";
      errorDescription = "You don't have the required permissions for this action.";
    } else if (error.message.includes('timed out') || error.message.includes('connection')) {
      errorMessage = "Database connection issue";
      errorDescription = "Please try again in a moment.";
    } else {
      errorDescription = error.message;
    }
  }
  
  toast.error(errorMessage, {
    description: errorDescription || "Unknown error occurred"
  });
};
