
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
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

export interface AuthProviderProps {
  children: React.ReactNode;
}
