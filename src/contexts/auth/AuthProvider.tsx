
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { robustSignOut } from '@/utils/supabase/auth-cleanup';
import { supabase } from '@/integrations/supabase/client';
import AuthContext from './AuthContext';
import { AuthProviderProps } from './types';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { 
    user, 
    session, 
    isAdmin, 
    isLoading, 
    isAdminChecked, 
    checkAdminStatus 
  } = useAuthState();
  
  const { 
    signIn, 
    signUp, 
    signOut: authSignOut, 
    resetPassword, 
    updatePassword 
  } = useAuthMethods();
  
  // Enhanced sign-out that uses our robust method
  const signOut = async () => {
    await robustSignOut({ supabase, redirectTo: '/auth' });
  };

  // Method to refresh admin status
  const refreshAdminStatus = async (userId: string): Promise<boolean> => {
    if (!userId) return false;
    return await checkAdminStatus(userId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        isAuthReady: !isLoading && isAdminChecked,
        signOut,
        refreshAdminStatus,
        signIn,
        signUp,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
