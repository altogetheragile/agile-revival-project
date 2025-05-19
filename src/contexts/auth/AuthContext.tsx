
import { createContext, useContext } from 'react';
import { AuthContextType } from './types';

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

export default AuthContext;
