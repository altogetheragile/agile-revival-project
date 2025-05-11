
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { User, Session } from '@supabase/supabase-js';
import { useDevMode } from '@/contexts/DevModeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { testConnection } from '@/utils/supabase/connection';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean }>;
  isAdmin: boolean;
  isAuthReady: boolean;
  refreshAdminStatus: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, session, isAdmin, isLoading, isAdminChecked, checkAdminStatus } = useAuthState();
  const { signIn, signUp, signOut, resetPassword, updatePassword } = useAuthMethods();
  const { devMode } = useDevMode();
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [authInitialized, setAuthInitialized] = useState(false);
  const MAX_RETRIES = 3;

  // Test database connectivity on mount
  useEffect(() => {
    const checkDatabaseConnection = async () => {
      try {
        console.log("[AuthContext Debug] Testing database connectivity...");
        const result = await testConnection();
        console.log("[AuthContext Debug] Database connection test result:", result);
        
        if (!result.isConnected) {
          console.error("[AuthContext Debug] Database connectivity issue:", result.error);
          setConnectionError(true);
          
          // Add specific guidance for common error types
          if (result.error?.message?.includes("infinite recursion")) {
            toast.error("Admin verification issue", {
              description: "There's an issue with role verification. Try enabling Dev Mode in the bottom left corner.",
              duration: 10000
            });
          } else if (result.responseTime > 8000) {
            toast.warning("Slow database connection", {
              description: "The database is responding slowly which may affect functionality.",
              duration: 8000
            });
          }
        } else {
          setConnectionError(false);
          setRetryCount(0);
        }
      } catch (err) {
        console.error("[AuthContext Debug] Error testing connection:", err);
        setConnectionError(true);
      } finally {
        // Mark auth as initialized even if there was an error
        setAuthInitialized(true);
      }
    };
    
    checkDatabaseConnection();
  }, []);

  // Add debug logging
  useEffect(() => {
    console.log("[AuthContext Debug] Auth state:", {
      user: user?.id,
      email: user?.email,
      isAdmin: devMode ? true : isAdmin,
      isLoading,
      isAdminChecked,
      devMode,
      connectionError,
      retryCount,
      authInitialized
    });
  }, [user, isAdmin, isLoading, isAdminChecked, devMode, connectionError, retryCount, authInitialized]);

  // Add connection monitoring and auto-recovery
  useEffect(() => {
    if (connectionError && retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        console.log(`[AuthContext] Attempting to reconnect (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        
        // Test the connection
        supabase.auth.getSession()
          .then(({ data, error }) => {
            if (error) {
              console.error("[AuthContext] Reconnection attempt failed:", error);
              setRetryCount(prev => prev + 1);
            } else {
              console.log("[AuthContext] Reconnection successful, resetting error state");
              setConnectionError(false);
              setRetryCount(0);
              
              if (retryCount > 0) {
                toast.success("Connection restored", {
                  description: "The connection to the authentication service has been restored."
                });
              }
            }
          })
          .catch(err => {
            console.error("[AuthContext] Error during reconnection:", err);
            setRetryCount(prev => prev + 1);
          });
      }, 5000 * Math.pow(2, retryCount)); // Exponential backoff
      
      return () => clearTimeout(timer);
    } else if (connectionError && retryCount >= MAX_RETRIES && !devMode) {
      // Suggest Dev Mode if all reconnection attempts fail
      toast.error("Authentication service unavailable", {
        description: "Try enabling Dev Mode from the control in the bottom left corner.",
        duration: 10000
      });
    }
  }, [connectionError, retryCount, devMode]);

  // Handle errors in the auth state
  useEffect(() => {
    const handleError = (error: any) => {
      console.error("[AuthContext] Auth error detected:", error);
      setConnectionError(true);
    };

    // Listen for auth errors
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log("[AuthContext] User signed out");
      } else if (event === 'SIGNED_IN') {
        console.log("[AuthContext] User signed in");
        // Reset error state on successful sign in
        setConnectionError(false);
        setRetryCount(0);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("[AuthContext] Token refreshed");
      } else if (event === 'USER_UPDATED') {
        console.log("[AuthContext] User updated");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Authorization is ready when either:
  // 1. We've finished loading and checked admin status, or
  // 2. Dev mode is enabled (bypasses auth checks)
  const isAuthReady = devMode || (!isLoading && isAdminChecked && authInitialized);

  const refreshAdminStatus = async (userId: string) => {
    console.log("[AuthContext Debug] Refreshing admin status for:", userId);
    
    // If dev mode is enabled, always return true for admin status
    if (devMode) {
      console.log("[AuthContext Debug] Dev mode enabled, returning true for admin status");
      return true;
    }
    
    // Otherwise actually check the admin status
    try {
      const result = await checkAdminStatus(userId);
      console.log("[AuthContext Debug] Admin status refresh result:", result);
      return result;
    } catch (error) {
      console.error("[AuthContext Debug] Error refreshing admin status:", error);
      // Show a helpful toast suggesting Dev Mode if admin check consistently fails
      toast.error("Admin verification failed", {
        description: "Unable to verify admin permissions. Try enabling Dev Mode in the bottom left corner.",
        duration: 7000
      });
      return false;
    }
  };

  const contextValue: AuthContextType = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    isAdmin: devMode ? true : isAdmin,
    isAuthReady,
    refreshAdminStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
