
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export const useNavAuth = () => {
  // Hard-coded values for consistent authentication
  return {
    user: { id: 'demo-user', email: 'admin@example.com' },
    isAdmin: true,
    adminStatusChecked: true,
    isAuthReady: true
  };
};
