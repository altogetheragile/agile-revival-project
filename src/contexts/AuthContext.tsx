import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { User, Session } from '@supabase/supabase-js';
import { useDevMode } from '@/contexts/DevModeContext';
import { useAuthDebug } from '@/hooks/useAuthDebug';
import { useAuthErrorMonitoring } from '@/hooks/useAuthErrorMonitoring';
import { toast } from 'sonner';
import { 
  checkDatabaseConnection, 
  setupConnectionMonitoring 
} from '@/utils/auth/connectionUtils';

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
  const { 
    user, 
    session, 
    isAdmin, 
    isLoading, 
    isAdminChecked, 
    checkAdminStatus, 
    clearRoleCache 
  } = useAuthState();
  const { signIn, signUp, signOut, resetPassword, updatePassword } = useAuthMethods();
  const { devMode } = useDevMode();
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Add debug logging
  useAuthDebug({
    user,
    isAdmin,
    isLoading,
    isAdminChecked,
    devMode,
    connectionError,
    retryCount,
    authInitialized
  });

  // Setup error monitoring
  useAuthErrorMonitoring({
    setConnectionError,
    setRetryCount
  });

  // Test database connectivity on mount - but do it only once
  useEffect(() => {
    if (!authInitialized) {
      checkDatabaseConnection(setConnectionError, setRetryCount, setAuthInitialized);
    }
  }, [authInitialized]);

  // Add connection monitoring and auto-recovery
  useEffect(() => {
    const cleanup = setupConnectionMonitoring(
      connectionError,
      retryCount,
      setConnectionError,
      setRetryCount,
      devMode
    );
    
    return cleanup;
  }, [connectionError, retryCount, devMode]);

  // Clear role cache on signout
  const handleSignOut = async () => {
    clearRoleCache();
    await signOut();
  };

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
      toast.error("Admin verification failed", {
        description: "Unable to verify admin status. Try refreshing the page.",
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
    signOut: handleSignOut, // Use our wrapper with cache clearing
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
