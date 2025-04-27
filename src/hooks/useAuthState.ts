
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Check if user has specific role
  const checkUserRole = useCallback(async (userId: string, role: string): Promise<boolean> => {
    console.log(`[Auth Debug] Checking ${role} status for user: ${userId}`);
    try {
      // Using RPC call to has_role function to prevent RLS recursion issues
      const { data, error } = await supabase.rpc('has_role', {
        user_id: userId,
        required_role: role
      });

      if (error) {
        console.error(`[Auth Debug] Error checking ${role} status:`, error);
        return false;
      }

      // Ensure we treat the response correctly as a boolean
      const hasRole = !!data;
      console.log(`[Auth Debug] ${role} status for ${userId}: ${hasRole ? 'has role' : 'does not have role'}`);
      
      return hasRole;
    } catch (error) {
      console.error(`[Auth Debug] Exception checking ${role} status:`, error);
      return false;
    }
  }, []);

  // Check if user is admin
  const checkAdminStatus = useCallback(async (userId: string): Promise<boolean> => {
    const isAdminUser = await checkUserRole(userId, 'admin');
    setIsAdmin(isAdminUser);
    return isAdminUser;
  }, [checkUserRole]);

  // Get user profile data
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[Auth Debug] Error fetching user profile:', error);
      }

      return data;
    } catch (error) {
      console.error('[Auth Debug] Exception fetching user profile:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    console.log("[Auth Debug] Setting up auth state listener");
    let isMounted = true;
    
    setIsLoading(true);
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log(`[Auth Debug] Auth state changed: ${event}`, { 
          email: currentSession?.user?.email,
          userId: currentSession?.user?.id,
          provider: currentSession?.user?.app_metadata?.provider
        });
        
        if (!isMounted) return;
        
        // Always update session and user state
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log(`[Auth Debug] User authenticated, email: ${currentSession.user.email}, id: ${currentSession.user.id}`);
          
          // Check admin status with retry mechanism
          const checkAdminWithRetry = async () => {
            if (!isMounted) return;
            
            // First attempt
            let isAdminUser = await checkAdminStatus(currentSession.user.id);
            
            // If not admin, try again after a delay (handles race conditions with new accounts)
            if (!isAdminUser && isMounted) {
              setTimeout(async () => {
                if (!isMounted) return;
                isAdminUser = await checkAdminStatus(currentSession.user.id);
                if (isMounted) setIsAuthReady(true);
              }, 500);
            } else if (isMounted) {
              setIsAuthReady(true);
            }
          };
          
          checkAdminWithRetry();
        } else {
          console.log("[Auth Debug] No authenticated user");
          setIsAdmin(false);
          setIsAuthReady(true);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("[Auth Debug] Initial session check result:", { 
        email: currentSession?.user?.email,
        userId: currentSession?.user?.id
      });
      
      if (!isMounted) return;
      
      // Update session and user state
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log(`[Auth Debug] Found existing session for: ${currentSession.user.email}`);
        
        // Check admin status with retry for initial load
        const checkAdminWithRetry = async () => {
          if (!isMounted) return;
          
          let isAdminUser = await checkAdminStatus(currentSession.user.id);
          
          if (!isAdminUser && isMounted) {
            setTimeout(async () => {
              if (!isMounted) return;
              isAdminUser = await checkAdminStatus(currentSession.user.id);
              if (isMounted) setIsAuthReady(true);
            }, 500);
          } else if (isMounted) {
            setIsAuthReady(true);
          }
        };
        
        checkAdminWithRetry();
      } else {
        setIsAuthReady(true);
      }
    }).catch(error => {
      console.error("[Auth Debug] Error checking initial session:", error);
      if (isMounted) {
        setIsAuthReady(true);
      }
    }).finally(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      console.log("[Auth Debug] Cleaning up auth subscription");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  return {
    user,
    session,
    isAdmin,
    isLoading,
    isAuthReady,
    checkAdminStatus,
    checkUserRole,
    fetchUserProfile
  };
}
