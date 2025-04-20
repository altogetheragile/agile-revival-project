
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export const useNavAuth = () => {
  const { user, isAdmin, isAuthReady } = useAuth();
  const [adminStatusChecked, setAdminStatusChecked] = useState(false);
  
  // For debugging purposes - log the current state
  console.log("useNavAuth returning:", { 
    isAdmin: !!isAdmin,
    adminStatusChecked, 
    isAuthReady,
  });

  // Always return consistent values
  return {
    user: user || null,
    isAdmin: !!isAdmin,
    adminStatusChecked: true,
    isAuthReady: true
  };
};
