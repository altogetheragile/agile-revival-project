
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useDevMode } from '@/contexts/DevModeContext';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminChecked, setIsAdminChecked] = useState(false);
  const { devMode } = useDevMode();
  
  // Role cache state with 5-minute expiration
  const [roleCache, setRoleCache] = useState<{[key: string]: {role: boolean, timestamp: number}}>({});
  const ROLE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const checkAdminStatus = useCallback(async (userId: string): Promise<boolean> => {
    // In dev mode, always grant admin access
    if (devMode) {
      console.log('[Auth Debug] Dev mode active, granting admin status');
      setIsAdmin(true);
      setIsAdminChecked(true);
      return true;
    }
    
    console.log(`[Auth Debug] Checking admin status for user: ${userId}`);
    
    // Check cache first to avoid unnecessary DB calls
    const cachedRole = roleCache[userId];
    const now = Date.now();
    
    if (cachedRole && (now - cachedRole.timestamp) < ROLE_CACHE_DURATION) {
      console.log('[Auth Debug] Using cached admin status:', cachedRole.role);
      setIsAdmin(cachedRole.role);
      setIsAdminChecked(true);
      return cachedRole.role;
    }
    
    try {
      // Use the optimized check_user_role function to avoid recursion issues
      const { data, error } = await supabase.rpc('check_user_role', {
        user_id: userId,
        required_role: 'admin'
      });

      if (error) {
        console.error('[Auth Debug] Error checking admin status:', error);
        setIsAdmin(false);
        setIsAdminChecked(true);
        return false;
      }

      // Ensure we treat the response correctly as a boolean
      const hasAdminRole = !!data;
      console.log(`[Auth Debug] Admin status for ${userId}: ${hasAdminRole ? 'admin' : 'not admin'}`);
      
      // Update cache
      setRoleCache(prev => ({
        ...prev,
        [userId]: {
          role: hasAdminRole,
          timestamp: now
        }
      }));
      
      setIsAdmin(hasAdminRole);
      setIsAdminChecked(true);
      
      return hasAdminRole;
    } catch (error) {
      console.error('[Auth Debug] Exception checking admin status:', error);
      setIsAdmin(false);
      setIsAdminChecked(true);
      return false;
    }
  }, [roleCache, devMode]);

  useEffect(() => {
    console.log("[Auth Debug] Setting up auth state listener");
    let isMounted = true;
    
    setIsLoading(true);
    
    // Initial session check on component mount - do this FIRST
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMounted) return;
      
      // Always update session and user state
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log(`[Auth Debug] Found existing session for: ${currentSession.user.email}`);
        
        // Check admin status immediately
        checkAdminStatus(currentSession.user.id);
      } else {
        setIsAdmin(false);
        setIsAdminChecked(true);
        setIsLoading(false);
      }
    }).catch(error => {
      console.error("[Auth Debug] Error checking initial session:", error);
      if (isMounted) {
        setIsLoading(false);
        setIsAdmin(false);
        setIsAdminChecked(true);
      }
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log(`[Auth Debug] Auth state changed: ${event}`);
        
        if (!isMounted) return;
        
        // Always update session and user state
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log(`[Auth Debug] User authenticated, email: ${currentSession.user.email}`);
          
          // Defer admin check to avoid Supabase auth deadlock
          setTimeout(() => {
            if (isMounted) {
              checkAdminStatus(currentSession.user.id);
              setIsLoading(false);
            }
          }, 0);
        } else {
          console.log("[Auth Debug] No authenticated user");
          setIsAdmin(false);
          setIsAdminChecked(true);
          setIsLoading(false);
        }
      }
    );

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
    isAdminChecked,
    checkAdminStatus
  };
}
