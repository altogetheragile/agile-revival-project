
import { createContext, useContext } from 'react';

// Create a simplified version of the context with no auth functionality
interface AuthContextType {
  user: null;
  session: null;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshAdminStatus: () => Promise<boolean>;
  isAuthReady: boolean;
}

// Create a dummy context with no functionality
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isAdmin: false,
  refreshAdminStatus: async () => false,
  isAuthReady: true
});

// Simplified provider with no authentication functionality
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const contextValue: AuthContextType = {
    user: null,
    session: null,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    isAdmin: false,
    refreshAdminStatus: async () => false,
    isAuthReady: true
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
