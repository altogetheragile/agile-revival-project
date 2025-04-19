
import { createContext, useContext, useEffect } from 'react';
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
  isAuthReady: boolean;
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

  // Add effect to check admin status when user changes
  useEffect(() => {
    const checkAdmin = async () => {
      if (user?.id && !isAdminChecked) {
        console.log(`Initial admin status check for user: ${user.email}`);
        await checkAdminStatus(user.id);
      }
    };
    
    checkAdmin();
  }, [user, checkAdminStatus, isAdminChecked]);

  const refreshAdminStatus = async () => {
    if (user?.id) {
      console.log(`Manually refreshing admin status for: ${user.email}`);
      return await checkAdminStatus(user.id);
    }
    return false;
  };

  console.log("AuthContext state:", { 
    user: user?.email, 
    isAdmin,
    isAdminChecked,
    userId: user?.id,
    isAuthReady: !isLoading
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
    refreshAdminStatus,
    isAuthReady: !isLoading
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
