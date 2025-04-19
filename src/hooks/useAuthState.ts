
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
    console.log(`Checking admin status for user: ${userId}`);
    try {
      // Make sure we're getting the most up-to-date data by disabling cache
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setIsAdminChecked(true);
        return false;
      }

      const hasAdminRole = !!data;
      console.log(`Admin check result for ${userId}:`, { hasAdminRole, data });
      
      // Important: Update the state to reflect admin status
      setIsAdmin(hasAdminRole);
      setIsAdminChecked(true);
      
      return hasAdminRole;
    } catch (error) {
      console.error('Exception checking admin status:', error);
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
      (event, currentSession) => {
        console.log(`Auth state changed: ${event}`, currentSession?.user?.email);
        
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log(`User authenticated, checking admin status for: ${currentSession.user.email}`);
          // Reset admin check status when user changes
          setIsAdminChecked(false);
          
          // Important: Don't block UI while checking admin status
          checkAdminStatus(currentSession.user.id)
            .then(adminStatus => {
              console.log(`Admin status set to ${adminStatus} for ${currentSession.user?.email}`);
              if (isMounted) {
                setIsLoading(false);
              }
            })
            .catch(() => {
              if (isMounted) {
                setIsLoading(false);
              }
            });
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
      console.log("Session check result:", currentSession?.user?.email);
      
      if (!isMounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log(`Found existing session for: ${currentSession.user.email}`);
        checkAdminStatus(currentSession.user.id)
          .then(adminStatus => {
            console.log(`Initial admin status set to ${adminStatus} for ${currentSession.user?.email}`);
            if (isMounted) {
              setIsLoading(false);
            }
          })
          .catch(() => {
            if (isMounted) {
              setIsLoading(false);
            }
          });
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
