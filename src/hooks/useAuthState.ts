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
    console.log(`DETAILED Admin Check - Checking admin status for user: ${userId}`);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      console.log('DETAILED Admin Check - Raw query result:', { data, error });

      if (error) {
        console.error('DETAILED Admin Check - Error checking admin status:', error);
        setIsAdmin(false);
        setIsAdminChecked(true);
        return false;
      }

      const hasAdminRole = !!data;
      console.log(`DETAILED Admin Check - Final admin status for ${userId}:`, { 
        hasAdminRole, 
        userEmail: userId,
        roleData: data 
      });
      
      setIsAdmin(hasAdminRole);
      setIsAdminChecked(true);
      
      return hasAdminRole;
    } catch (error) {
      console.error('DETAILED Admin Check - Exception checking admin status:', error);
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
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log(`User authenticated, email: ${currentSession.user.email}, id: ${currentSession.user.id}, provider: ${currentSession.user.app_metadata?.provider || 'email'}`);
          setIsAdminChecked(false);
          setIsAdmin(false);
          
          setTimeout(async () => {
            if (!isMounted) return;
            try {
              const adminStatus = await checkAdminStatus(currentSession.user.id);
              console.log(`Admin status for ${currentSession.user.email} (${currentSession.user.app_metadata?.provider || 'email'}): ${adminStatus ? 'admin' : 'not admin'}`);
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
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check result:", { 
        email: currentSession?.user?.email,
        provider: currentSession?.user?.app_metadata?.provider
      });
      
      if (!isMounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log(`Found existing session for: ${currentSession.user.email}, id: ${currentSession.user.id}, provider: ${currentSession.user.app_metadata?.provider || 'email'}`);
        
        const isGoogleAuth = currentSession.user.app_metadata?.provider === 'google';
        const checkDelay = isGoogleAuth ? 10 : 100;
        
        setTimeout(async () => {
          if (!isMounted) return;
          try {
            console.log(`Checking admin status with ${checkDelay}ms delay for provider: ${currentSession.user.app_metadata?.provider || 'email'}`);
            const adminStatus = await checkAdminStatus(currentSession.user.id);
            console.log(`Initial admin status set to ${adminStatus ? 'admin' : 'not admin'} for ${currentSession.user?.email} (${currentSession.user.app_metadata?.provider || 'email'})`);
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
