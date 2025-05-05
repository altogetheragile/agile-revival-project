
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { User, Session } from '@supabase/supabase-js';
import { useDevMode } from '@/contexts/DevModeContext';

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

  // Add debug logging
  useEffect(() => {
    console.log("[AuthContext Debug] Auth state:", {
      user: user?.id,
      email: user?.email,
      isAdmin: devMode ? true : isAdmin,
      isLoading,
      isAdminChecked,
      devMode
    });
  }, [user, isAdmin, isLoading, isAdminChecked, devMode]);

  // Authorization is ready when we've finished loading and checked admin status
  const isAuthReady = !isLoading && isAdminChecked;

  const refreshAdminStatus = async (userId: string) => {
    console.log("[AuthContext Debug] Refreshing admin status for:", userId);
    return devMode ? true : await checkAdminStatus(userId);
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
