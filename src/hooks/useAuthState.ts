
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminChecked, setIsAdminChecked] = useState(false);

  // Improved function to check admin status with better logging
  const checkAdminStatus = async (userId: string) => {
    console.log(`Checking admin status for user: ${userId}`);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return false;
      }

      const hasAdminRole = !!data;
      console.log(`Admin check result for ${userId}:`, { hasAdminRole, data });
      setIsAdmin(hasAdminRole);
      setIsAdminChecked(true);
      return hasAdminRole;
    } catch (error) {
      console.error('Exception checking admin status:', error);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener");
    let isMounted = true;
    
    // Set up auth state change listener first before checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log(`Auth state changed: ${event}`, currentSession?.user?.email);
        
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log(`User authenticated, checking admin status for: ${currentSession.user.email}`);
          // Use setTimeout to avoid potential recursive issues with Supabase client
          setTimeout(async () => {
            if (isMounted) {
              await checkAdminStatus(currentSession.user.id);
            }
          }, 0);
        } else {
          console.log("No authenticated user, clearing admin status");
          setIsAdmin(false);
          setIsAdminChecked(false);
        }
      }
    );

    console.log("Initial session check on component mount");
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Session check result:", currentSession?.user?.email);
      
      if (!isMounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log(`Found existing session for: ${currentSession.user.email}`);
        // Directly check admin status here for initial load
        await checkAdminStatus(currentSession.user.id);
      }
      setIsLoading(false);
    }).catch(error => {
      console.error("Error checking initial session:", error);
      setIsLoading(false);
    });

    return () => {
      console.log("Cleaning up auth subscription");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    isAdmin,
    isLoading,
    isAdminChecked,
    checkAdminStatus
  };
}
