
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { robustSignOut } from '@/utils/supabase/auth-cleanup';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthReady: boolean;
  signOut: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  isLoading: true,
  isAuthReady: false,
  signOut: async () => {},
});

// Custom hook for easy context usage
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, session, isAdmin, isLoading, isAdminChecked } = useAuthState();
  
  // Enhanced sign-out that uses our robust method
  const signOut = async () => {
    await robustSignOut({ supabase, redirectTo: '/auth' });
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
