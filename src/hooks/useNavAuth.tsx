
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export const useNavAuth = () => {
  const { user, isAdmin, refreshAdminStatus, isAuthReady } = useAuth();
  const [adminStatusChecked, setAdminStatusChecked] = useState(false);
  
  // Primary effect for checking admin status when user changes or auth is ready
  useEffect(() => {
    let isMounted = true;
    
    const checkAdminStatus = async () => {
      if (user?.id && isAuthReady) {
        const isGoogleAuth = user.app_metadata?.provider === 'google';
        console.log(`NavAuth - Checking admin status for ${user.email} (${user.app_metadata?.provider || 'email'})`);
        
        try {
          // For Google auth, we need to check immediately without delay
          const checkDelay = isGoogleAuth ? 0 : 100;
          
          setTimeout(async () => {
            if (!isMounted) return;
            
            const refreshedAdminStatus = await refreshAdminStatus();
            
            if (isMounted) {
              console.log(`NavAuth - Admin status refreshed: ${refreshedAdminStatus ? 'admin' : 'not admin'} for ${user.email} (${user.app_metadata?.provider || 'email'})`);
              setAdminStatusChecked(true);
            }
          }, checkDelay);
        } catch (error) {
          console.error("NavAuth - Error checking admin status:", error);
          if (isMounted) setAdminStatusChecked(true);
        }
      } else if (!user) {
        // Reset state when user is null
        setAdminStatusChecked(false);
        console.log("NavAuth - No authenticated user, resetting admin status");
      }
    };
    
    checkAdminStatus();
    
    return () => {
      isMounted = false;
    };
  }, [user, isAuthReady, refreshAdminStatus]);

  // Special effect specifically for Google authentication
  useEffect(() => {
    // If we detect Google auth, let's double-check admin status
    // This helps handle cases where the database updates might be delayed
    if (user?.app_metadata?.provider === 'google' && isAuthReady) {
      console.log('NavAuth - Detected Google auth, force-checking admin status');
      refreshAdminStatus();
    }
  }, [user?.app_metadata?.provider, isAuthReady, refreshAdminStatus]);

  // For debugging purposes - log the current state
  console.log("useNavAuth returning:", { 
    userEmail: user?.email, 
    isAdmin: !!isAdmin,
    adminStatusChecked, 
    isAuthReady,
    userDefined: !!user
  });

  // Always return consistent values
  // user should be null (not undefined) when not authenticated
  // isAdmin should be a boolean (not undefined)
  return {
    user: user || null,
    isAdmin: !!isAdmin,
    adminStatusChecked,
    isAuthReady
  };
};
