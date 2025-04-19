
import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
    signOut,
  } = useAuthMethods();

  const refreshAdminStatus = async () => {
    if (user?.id) {
      console.log(`Manually refreshing admin status for: ${user.email}`);
      await checkAdminStatus(user.id);
    }
  };

  console.log("AuthContext state:", { 
    user: user?.email, 
    isAdmin,
    isAdminChecked,
    userId: user?.id
  });
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading authentication...</div>;
  }
  
  const contextValue: AuthContextType = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    isAdmin,
    refreshAdminStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
