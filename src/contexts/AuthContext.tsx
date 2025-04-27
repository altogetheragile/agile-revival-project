
import { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { useResetPassword } from '@/hooks/useResetPassword';
import { User, Session } from '@supabase/supabase-js';

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
  const { signIn, signUp, signOut, updatePassword } = useAuthMethods();
  const { handleResetPassword } = useResetPassword();

  // Authorization is ready when we've finished loading and checked admin status
  const isAuthReady = !isLoading && isAdminChecked;

  const refreshAdminStatus = async (userId: string) => {
    return await checkAdminStatus(userId);
  };

  const contextValue: AuthContextType = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    resetPassword: handleResetPassword,
    updatePassword,
    isAdmin,
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
