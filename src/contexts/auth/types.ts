
import { Session, User } from "@supabase/supabase-js";

export type Role = "admin" | "user" | null;

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: Role;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

export interface ResetPasswordResult {
  success: boolean;
  message: string;
}
