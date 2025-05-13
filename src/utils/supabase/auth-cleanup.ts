
/**
 * Thoroughly cleans up all Supabase authentication state from browser storage
 * to prevent authentication "limbo" states
 */
export const cleanupAuthState = () => {
  try {
    console.log("[Auth] Cleaning up auth state...");
    
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log(`[Auth] Removing localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          console.log(`[Auth] Removing sessionStorage key: ${key}`);
          sessionStorage.removeItem(key);
        }
      });
    }
    
    console.log("[Auth] Auth state cleanup complete");
  } catch (error) {
    console.error("[Auth] Error during auth state cleanup:", error);
  }
};

/**
 * Performs a robust sign out with thorough cleanup
 * @param options Options for the sign out operation
 * @returns Promise that resolves when sign out is complete
 */
export const robustSignOut = async ({ 
  supabase, 
  redirectTo = '/auth',
  forceRefresh = true 
}: { 
  supabase: any, 
  redirectTo?: string,
  forceRefresh?: boolean
}) => {
  try {
    console.log("[Auth] Starting robust sign out...");
    
    // First clean up the auth state
    cleanupAuthState();
    
    // Try to sign out globally
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.warn("[Auth] Global sign out failed, continuing:", err);
    }
    
    if (forceRefresh) {
      // Force a page reload for a completely clean state
      console.log(`[Auth] Redirecting to: ${redirectTo}`);
      window.location.href = redirectTo;
    }
    
    return true;
  } catch (error) {
    console.error("[Auth] Error during sign out:", error);
    return false;
  }
};
