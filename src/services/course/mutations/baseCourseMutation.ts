
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { executeQuery } from "@/utils/supabase/query";
import { User } from "@supabase/supabase-js";

// Interface for authentication data response matching the actual structure
export interface UserData {
  user: User | null;
}

// Check if Dev Mode is active - more reliable implementation
const isDevModeActive = (): boolean => {
  // First, try checking localStorage
  try {
    const devModeEnabled = localStorage.getItem('devModeEnabled') === 'true';
    console.log("🔍 [Dev Mode Check] Current state:", devModeEnabled);
    return devModeEnabled;
  } catch (e) {
    console.error("❌ Error checking Dev Mode status from localStorage:", e);
    
    // Fallback - check if we have the dev mode admin user in session
    try {
      const session = supabase.auth.getSession();
      if (session) {
        // If the session has our dev mode user ID, consider dev mode active
        const hasDevUser = session.then(result => 
          result.data?.session?.user?.id === "00000000-0000-0000-0000-000000000000"
        ).catch(() => false);
        
        return hasDevUser ? true : false;
      }
    } catch (err) {
      console.error("❌ Error in fallback Dev Mode check:", err);
    }
    
    return false;
  }
};

// Shared utility for getting authenticated user
export const getAuthenticatedUser = async (): Promise<User | null> => {
  try {
    // In Dev Mode, return a mock user with admin privileges
    if (isDevModeActive()) {
      console.log("⚙️ [Dev Mode] Bypassing authentication check, returning mock admin user");
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
    
    // Log that we're checking for a real user
    console.log("🔍 Checking for authenticated user...");
    
    const { data: authData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("❌ Error getting authenticated user:", userError);
      toast.error("Authentication required", {
        description: "You must be logged in to perform this action."
      });
      return null;
    }
    
    if (!authData?.user) {
      console.error("❌ No authenticated user found");
      toast.error("Authentication required", {
        description: "You must be logged in to perform this action."
      });
      return null;
    }
    
    console.log("✅ Authenticated user found:", authData.user.email);
    return authData.user;
  } catch (err) {
    console.error("❌ Exception in getAuthenticatedUser:", err);
    toast.error("Authentication error", {
      description: "Failed to verify authentication status."
    });
    return null;
  }
};

// Utility to check if user has admin role using the standardized check_user_role function
export const checkAdminRole = async (userId: string): Promise<boolean> => {
  try {
    // In Dev Mode, always return true for admin role
    if (isDevModeActive()) {
      console.log("⚙️ [Dev Mode] Bypassing admin role check, granting admin privileges");
      return true;
    }
    
    console.log("🔍 Checking if user has admin role:", userId);
    
    // Direct RPC call to the standardized database function
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
      console.error("❌ Error checking admin role:", roleError);
      toast.error("Permission check failed", {
        description: "Unable to verify admin permissions."
      });
      return false;
    }

    if (!isAdmin) {
      console.error("❌ User lacks admin role:", userId);
      toast.error("Access denied", {
        description: "Admin privileges required for this action."
      });
      return false;
    }

    console.log("✅ User has admin role confirmed");
    return true;
  } catch (err) {
    console.error("❌ Exception checking admin role:", err);
    toast.error("Permission check failed", {
      description: "Unable to verify admin permissions due to an error."
    });
    return false;
  }
};

// Handles standard error messaging
export const handleMutationError = (error: any, defaultMessage: string): void => {
  console.error(`❌ Error in course mutation: ${defaultMessage}`, error);
  
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
    } else if (error.message.includes('infinite recursion detected')) {
      errorMessage = "Database configuration issue";
      errorDescription = "The system encountered a permission check loop. Please try again later.";
    } else {
      errorDescription = error.message;
    }
  }
  
  toast.error(errorMessage, {
    description: errorDescription || "Unknown error occurred"
  });
};
