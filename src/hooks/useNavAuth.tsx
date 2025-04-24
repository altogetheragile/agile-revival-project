
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export const useNavAuth = () => {
  // Using a valid UUID format for the demo user
  // This matches what we'd expect from Supabase auth
  return {
    user: { id: '00000000-0000-0000-0000-000000000000', email: 'admin@example.com' },
    isAdmin: true,
    adminStatusChecked: true,
    isAuthReady: true
  };
};
