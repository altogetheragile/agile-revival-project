
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

type Role = "admin" | "user" | null;

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Don't make Supabase calls directly in the auth state change handler
        // Use setTimeout to avoid potential deadlocks
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserRole(currentSession.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserRole(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUserRole(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) throw error;
      
      setUserRole(data ? 'admin' : 'user');
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user'); // Default to 'user' role on error
    }
  }

  async function signUp(email: string, password: string, firstName: string, lastName: string) {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      // Define the full URL for password reset
      const redirectUrl = `${window.location.origin}/auth?tab=login`;
      console.log("Reset password redirect URL:", redirectUrl);
      
      const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Please check your inbox and spam folder for the password reset link.",
      });
      
      return { 
        success: true, 
        message: "If an account exists with this email, you will receive password reset instructions." 
      };
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      toast({
        title: "Password reset request sent",
        description: "If an account exists with this email, you will receive password reset instructions.",
      });
      
      // Return success even on error to prevent user enumeration
      return { 
        success: false, 
        message: error.message || "An unexpected error occurred" 
      };
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      
      setUserRole(null);
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  }

  const value = {
    session,
    user,
    userRole,
    isLoading,
    isAdmin: userRole === 'admin',
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
