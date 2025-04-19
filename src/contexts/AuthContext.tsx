
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshAdminStatus: () => Promise<boolean>;
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
  
  const [hasInitialAdminCheck, setHasInitialAdminCheck] = useState(false);

  const {
    signIn,
    signUp,
    signOut,
  } = useAuthMethods();

  // Add effect to check admin status when user changes or auth is ready
  useEffect(() => {
    let isMounted = true;
    
    const checkAdmin = async () => {
      if (user?.id) {
        console.log(`Auth provider - Checking admin status for: ${user.email}, id: ${user.id}`);
        
        try {
          // Use setTimeout to avoid potential deadlock
          setTimeout(async () => {
            if (isMounted && user?.id) {
              const result = await checkAdminStatus(user.id);
              console.log(`Auth provider - Admin check result for ${user.email}: ${result ? 'admin' : 'not admin'}`);
              setHasInitialAdminCheck(true);
            }
          }, 100);
        } catch (error) {
          console.error("Auth provider - Error checking admin status:", error);
          if (isMounted) {
            setHasInitialAdminCheck(true); // Mark as checked even on error
          }
        }
      }
    };
    
    // Only run check if we have a user and haven't checked yet
    if (user?.id && !hasInitialAdminCheck) {
      checkAdmin();
    } else if (!user) {
      // Reset check state if no user
      setHasInitialAdminCheck(false);
    }
  }, [user, checkAdminStatus, hasInitialAdminCheck]);

  const refreshAdminStatus = async (): Promise<boolean> => {
    if (user?.id) {
      console.log(`AuthContext - Manually refreshing admin status for: ${user.email}, id: ${user.id}`);
      try {
        // Force a fresh check from the database
        const result = await checkAdminStatus(user.id);
        console.log(`AuthContext - Admin status after refresh: ${result ? 'admin' : 'not admin'} for ${user.email}`);
        return result;
      } catch (error) {
        console.error('Error refreshing admin status:', error);
        return false;
      }
    }
    return false;
  };

  console.log("AuthContext state:", { 
    userEmail: user?.email, 
    isAdmin,
    isAdminChecked,
    userId: user?.id,
    isAuthReady: !isLoading,
    isLoading,
    provider: user?.app_metadata?.provider
  });
  
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

  // If still loading auth state, render a simple loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-agile-purple animate-spin mb-2" />
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Export the useAuth hook separately to avoid circular dependencies
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
