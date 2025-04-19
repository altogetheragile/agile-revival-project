
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminChecked, setIsAdminChecked] = useState(false);

  // Improved function to check admin status with better logging
  const checkAdminStatus = useCallback(async (userId: string): Promise<boolean> => {
    console.log(`useAuthState - Checking admin status for user: ${userId}`);
    try {
      // Make sure we're getting the most up-to-date data by disabling cache
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('useAuthState - Error checking admin status:', error);
        setIsAdmin(false);
        setIsAdminChecked(true);
        return false;
      }

      const hasAdminRole = !!data;
      console.log(`useAuthState - Admin check result for ${userId}:`, { hasAdminRole, data });
      
      // Important: Update the state to reflect admin status
      setIsAdmin(hasAdminRole);
      setIsAdminChecked(true);
      
      return hasAdminRole;
    } catch (error) {
      console.error('useAuthState - Exception checking admin status:', error);
      setIsAdmin(false);
      setIsAdminChecked(true);
      return false;
    }
  }, []);

  useEffect(() => {
    console.log("Setting up auth state listener");
    let isMounted = true;
    
    // Set loading to true at the start
    setIsLoading(true);
    
    // Set up auth state change listener first before checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log(`Auth state changed: ${event}`, currentSession?.user?.email);
        
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log(`User authenticated, email: ${currentSession.user.email}, id: ${currentSession.user.id}, provider: ${currentSession.user.app_metadata.provider || 'email'}`);
          // Reset admin check status when user changes
          setIsAdminChecked(false);
          setIsAdmin(false); // Reset admin status until it's checked
          
          // Check admin status via setTimeout to prevent potential deadlock
          setTimeout(async () => {
            if (!isMounted) return;
            try {
              const adminStatus = await checkAdminStatus(currentSession.user.id);
              console.log(`Admin status for ${currentSession.user.email}: ${adminStatus ? 'admin' : 'not admin'}`);
              if (isMounted) {
                setIsLoading(false);
              }
            } catch (error) {
              console.error('Error checking admin status during auth change:', error);
              if (isMounted) {
                setIsLoading(false);
              }
            }
          }, 100);
        } else {
          console.log("No authenticated user, clearing admin status");
          setIsAdmin(false);
          setIsAdminChecked(true);
          setIsLoading(false);
        }
      }
    );

    console.log("Initial session check on component mount");
    // Perform initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check result:", currentSession?.user?.email);
      
      if (!isMounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log(`Found existing session for: ${currentSession.user.email}, id: ${currentSession.user.id}, provider: ${currentSession.user.app_metadata.provider || 'email'}`);
        
        // Use setTimeout to prevent deadlock with the auth state change handler
        setTimeout(async () => {
          if (!isMounted) return;
          try {
            const adminStatus = await checkAdminStatus(currentSession.user.id);
            console.log(`Initial admin status set to ${adminStatus ? 'admin' : 'not admin'} for ${currentSession.user?.email}`);
            if (isMounted) {
              setIsLoading(false);
            }
          } catch (error) {
            console.error('Error during initial admin check:', error);
            if (isMounted) {
              setIsLoading(false);
            }
          }
        }, 100);
      } else {
        if (isMounted) setIsLoading(false);
      }
    }).catch(error => {
      console.error("Error checking initial session:", error);
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
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
