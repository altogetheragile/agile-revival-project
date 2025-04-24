
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export const useNavAuth = () => {
  // Using the actual auth context to get the correct auth state
  try {
    const { user, isAdmin, isAuthReady } = useAuth();
    
    return {
      user,
      isAdmin,
      adminStatusChecked: isAuthReady,
      isAuthReady
    };
  } catch (error) {
    // Fallback for demo purposes when AuthContext is not available
    // This should only happen during development
    console.warn('Auth context not available, using demo data');
    
    return {
      user: { id: '00000000-0000-0000-0000-000000000000', email: 'admin@example.com' },
      isAdmin: true,
      adminStatusChecked: true,
      isAuthReady: true
    };
  }
};
