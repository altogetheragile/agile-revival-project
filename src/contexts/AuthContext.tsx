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

  const verifyAdminStatus = async () => {
    if (user?.id) {
      console.log(`ADMIN VERIFICATION - Checking admin status for: ${user.email}`);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin');

      console.log('ADMIN VERIFICATION - Detailed Role Check:', {
        email: user.email,
        userId: user.id,
        googleProvider: user.app_metadata?.provider === 'google',
        roleQueryData: data,
        roleQueryError: error
      });

      return data && data.length > 0;
    }
    return false;
  };

  const refreshAdminStatus = async (): Promise<boolean> => {
    const isAdmin = await verifyAdminStatus();
    console.log(`ADMIN STATUS REFRESH - Final result for ${user?.email}:`, isAdmin);
    return isAdmin;
  };

  useEffect(() => {
    let isMounted = true;
    
    const checkAdmin = async () => {
      if (user?.id) {
        const isGoogleAuth = user.app_metadata?.provider === 'google';
        console.log(`Auth provider - Checking admin status for: ${user.email}, id: ${user.id}, provider: ${user.app_metadata?.provider || 'email'}`);
        
        try {
          const checkDelay = isGoogleAuth ? 10 : 100;
          
          setTimeout(async () => {
            if (isMounted && user?.id) {
              const result = await checkAdminStatus(user.id);
              console.log(`Auth provider - Admin check result for ${user.email} (${user.app_metadata?.provider || 'email'}): ${result ? 'admin' : 'not admin'}`);
              setHasInitialAdminCheck(true);
            }
          }, checkDelay);
        } catch (error) {
          console.error("Auth provider - Error checking admin status:", error);
          if (isMounted) {
            setHasInitialAdminCheck(true);
          }
        }
      }
    };
    
    const isGoogleAuth = user?.app_metadata?.provider === 'google';
    const shouldForceCheck = user?.id && (!hasInitialAdminCheck || isGoogleAuth);
    
    if (shouldForceCheck) {
      checkAdmin();
    } else if (!user) {
      setHasInitialAdminCheck(false);
    }
  }, [user, checkAdminStatus, hasInitialAdminCheck]);

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
