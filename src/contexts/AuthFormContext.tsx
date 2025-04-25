
import { createContext, useContext, ReactNode } from 'react';
import { AuthMode } from '@/components/auth/AuthContainer';

interface AuthFormContextType {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const AuthFormContext = createContext<AuthFormContextType | undefined>(undefined);

export function useAuthForm() {
  const context = useContext(AuthFormContext);
  if (!context) {
    throw new Error('useAuthForm must be used within an AuthFormProvider');
  }
  return context;
}

export function AuthFormProvider({ 
  children, 
  value 
}: { 
  children: ReactNode;
  value: AuthFormContextType;
}) {
  return (
    <AuthFormContext.Provider value={value}>
      {children}
    </AuthFormContext.Provider>
  );
}
