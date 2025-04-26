
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
    console.log(`Checking admin status for user: ${userId}`);
    try {
      // Using RPC call to has_role function to prevent RLS recursion issues
      const { data, error } = await supabase.rpc('has_role', {
        user_id: userId,
        required_role: 'admin'
      });

      console.log('Admin check result:', { data, error });

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setIsAdminChecked(true);
        return false;
      }

      // Ensure we treat the response correctly as a boolean
      const hasAdminRole = !!data;
      console.log(`Admin status for ${userId}: ${hasAdminRole ? 'admin' : 'not admin'}`);
      
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
    
    setIsLoading(true);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log(`Auth state changed: ${event}`, { 
          email: currentSession?.user?.email,
          provider: currentSession?.user?.app_metadata?.provider
        });
        
        if (!isMounted) return;
        
        // Always update session and user state
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log(`User authenticated, email: ${currentSession.user.email}, id: ${currentSession.user.id}, provider: ${currentSession.user.app_metadata?.provider || 'email'}`);
          setIsAdminChecked(false);
          setIsAdmin(false);
          
          // Added delay to ensure Supabase has fully processed the authentication
          setTimeout(async () => {
            if (!isMounted) return;
            try {
              await checkAdminStatus(currentSession.user.id);
              if (isMounted) {
                setIsLoading(false);
              }
            } catch (error) {
              console.error('Error checking admin status during auth change:', error);
              if (isMounted) {
                setIsLoading(false);
              }
            }
          }, 300); // Increased delay to give more time for roles to be properly synchronized
        } else {
          console.log("No authenticated user, clearing admin status");
          setIsAdmin(false);
          setIsAdminChecked(true);
          setIsLoading(false);
        }
      }
    );

    console.log("Initial session check on component mount");
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check result:", { 
        email: currentSession?.user?.email,
        provider: currentSession?.user?.app_metadata?.provider
      });
      
      if (!isMounted) return;
      
      // Always update session and user state
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log(`Found existing session for: ${currentSession.user.email}, id: ${currentSession.user.id}, provider: ${currentSession.user.app_metadata?.provider || 'email'}`);
        
        const isGoogleAuth = currentSession.user.app_metadata?.provider === 'google';
        const checkDelay = isGoogleAuth ? 300 : 500; // Increased delays for more reliable role checking
        
        setTimeout(async () => {
          if (!isMounted) return;
          try {
            console.log(`Checking admin status with ${checkDelay}ms delay for provider: ${currentSession.user.app_metadata?.provider || 'email'}`);
            await checkAdminStatus(currentSession.user.id);
            if (isMounted) {
              setIsLoading(false);
            }
          } catch (error) {
            console.error('Error during initial admin check:', error);
            if (isMounted) {
              setIsLoading(false);
            }
          }
        }, checkDelay);
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
