
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminChecked, setIsAdminChecked] = useState(false);

  const checkAdminStatus = useCallback(async (userId: string): Promise<boolean> => {
    console.log(`[Auth Debug] Checking admin status for user: ${userId}`);
    try {
      // Call the has_role RPC function with explicit parameter names
      const { data, error } = await supabase.rpc('has_role', {
        user_id: userId,
        role: 'admin'
      } as any); // Type assertion to bypass TS strict checking

      console.log('[Auth Debug] Admin check result:', { data, error });

      if (error) {
        console.error('[Auth Debug] Error checking admin status:', error);
        // Show detailed error information to help diagnose issues
        console.error('[Auth Debug] Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // Check for specific errors that might indicate an RLS recursion issue
        if (error.message?.includes('infinite recursion') || 
            error.message?.includes('permission denied')) {
          console.warn('[Auth Debug] Possible RLS recursion or permission issue detected');
        }
        
        // Even if there's an error, we'll continue without admin access
        setIsAdmin(false);
        setIsAdminChecked(true);
        return false;
      }

      // Ensure we treat the response correctly as a boolean
      const hasAdminRole = !!data;
      console.log(`[Auth Debug] Admin status for ${userId}: ${hasAdminRole ? 'admin' : 'not admin'}`);
      
      setIsAdmin(hasAdminRole);
      setIsAdminChecked(true);
      
      return hasAdminRole;
    } catch (error) {
      console.error('[Auth Debug] Exception checking admin status:', error);
      // Handle unexpected errors gracefully
      setIsAdmin(false);
      setIsAdminChecked(true);
      return false;
    }
  }, []);

  useEffect(() => {
    console.log("[Auth Debug] Setting up auth state listener");
    let isMounted = true;
    
    setIsLoading(true);
    
    // Initial session check on component mount - do this FIRST
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("[Auth Debug] Initial session check result:", { 
        email: currentSession?.user?.email,
        userId: currentSession?.user?.id,
        provider: currentSession?.user?.app_metadata?.provider,
        expires_at: currentSession?.expires_at
      });
      
      if (!isMounted) return;
      
      // Always update session and user state
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log(`[Auth Debug] Found existing session for: ${currentSession.user.email}, id: ${currentSession.user.id}`);
        
        // Check for session expiration
        const expiresAt = currentSession.expires_at;
        if (expiresAt) {
          const currentTime = Math.floor(Date.now() / 1000); // convert to seconds
          if (expiresAt < currentTime) {
            console.log("[Auth Debug] Session has expired, will force refresh");
            supabase.auth.refreshSession(); // Attempt to refresh the session
          }
        }
        
        // Check admin status immediately
        checkAdminStatus(currentSession.user.id).then(isAdmin => {
          console.log("[Auth Debug] Initial admin check result:", isAdmin);
          if (!isAdmin) {
            // Double check once more after a brief delay in case of temporary DB issues
            setTimeout(() => {
              if (isMounted) {
                checkAdminStatus(currentSession.user.id);
              }
            }, 2000);
          }
        });
      } else {
        if (isMounted) {
          setIsAdmin(false);
          setIsAdminChecked(true);
          setIsLoading(false);
        }
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
          setIsAdminChecked(false);
          
          // Check admin status with retry on failure
          let attempts = 0;
          let isAdminUser = false;
          
          const tryCheckAdmin = async () => {
            try {
              isAdminUser = await checkAdminStatus(currentSession.user.id);
              console.log("[Auth Debug] Admin check complete, result:", isAdminUser);
              return true;
            } catch (err) {
              console.error(`[Auth Debug] Admin check attempt ${attempts + 1} failed:`, err);
              return false;
            }
          };
          
          // First attempt
          const success = await tryCheckAdmin();
          
          // Retry once after a delay if first attempt failed
          if (!success && attempts < 1) {
            attempts++;
            setTimeout(async () => {
              if (isMounted) {
                await tryCheckAdmin();
                setIsLoading(false);
              }
            }, 2000);
          } else {
            if (isMounted) setIsLoading(false);
          }
        } else {
          console.log("[Auth Debug] No authenticated user, clearing admin status");
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
