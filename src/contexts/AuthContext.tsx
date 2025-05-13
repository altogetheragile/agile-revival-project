
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { robustSignOut } from '@/utils/supabase/auth-cleanup';
import { useAuthMethods } from '@/hooks/useAuthMethods';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthReady: boolean;
  signOut: () => Promise<void>;
  refreshAdminStatus: (userId: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (newPassword: string) => Promise<any>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  isLoading: true,
  isAuthReady: false,
  signOut: async () => {},
  refreshAdminStatus: async () => false,
  signIn: async () => {},
  signUp: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
});

// Custom hook for easy context usage
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { 
    user, 
    session, 
    isAdmin, 
    isLoading, 
    isAdminChecked, 
    checkAdminStatus 
  } = useAuthState();
  
  const { 
    signIn, 
    signUp, 
    signOut: authSignOut, 
    resetPassword, 
    updatePassword 
  } = useAuthMethods();
  
  // Enhanced sign-out that uses our robust method
  const signOut = async () => {
    await robustSignOut({ supabase, redirectTo: '/auth' });
  };

  // Method to refresh admin status
  const refreshAdminStatus = async (userId: string): Promise<boolean> => {
    if (!userId) return false;
    return await checkAdminStatus(userId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        isAuthReady: !isLoading && isAdminChecked,
        signOut,
        refreshAdminStatus,
        signIn,
        signUp,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
