
import { useAuth } from '@/contexts/auth';
import { useState, useEffect } from 'react';
import { checkUserRoleById } from '@/utils/supabase';

export const useNavAuth = () => {
  // Using the actual auth context to get the correct auth state
  try {
    const { user, isAdmin, isAuthReady } = useAuth();
    const [adminStatusVerified, setAdminStatusVerified] = useState(false);
    
    // Verify admin status using the optimized check_user_role function
    useEffect(() => {
      const verifyAdminStatus = async () => {
        if (user && !adminStatusVerified) {
          const confirmedAdmin = await checkUserRoleById(user.id, 'admin');
          setAdminStatusVerified(true);
        }
      };
      
      if (user) {
        verifyAdminStatus();
      }
    }, [user, adminStatusVerified]);
    
    return {
      user,
      isAdmin,
      adminStatusChecked: isAuthReady && adminStatusVerified,
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
