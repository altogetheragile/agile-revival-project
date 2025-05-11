
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';

interface AuthDebugInfo {
  user?: User | null;
  userId?: string | null;
  email?: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAdminChecked: boolean;
  devMode: boolean;
  connectionError: boolean;
  retryCount: number;
  authInitialized: boolean;
}

export const useAuthDebug = ({
  user,
  isAdmin,
  isLoading,
  isAdminChecked,
  devMode,
  connectionError,
  retryCount,
  authInitialized
}: AuthDebugInfo): void => {
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
};
