
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthForms from './AuthForms';
import AuthenticatedView from './AuthenticatedView';

export type AuthMode = 'login' | 'signup' | 'reset';

export default function AuthContainer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (user || session?.user) {
        console.log('User is authenticated:', { user: user?.email });
        setIsAuthenticated(true);
      } else {
        console.log('User is not authenticated');
        setIsAuthenticated(false);
      }
    };
    
    checkAuthStatus();
  }, [user, session]);

  if (isAuthenticated || user) {
    return <AuthenticatedView />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Please sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForms />
        </CardContent>
      </Card>
    </div>
  );
}
