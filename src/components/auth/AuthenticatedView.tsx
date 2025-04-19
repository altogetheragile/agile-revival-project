
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut, LayoutDashboard, UserCheck } from 'lucide-react';

export default function AuthenticatedView() {
  const { user, signOut, isAdmin, refreshAdminStatus, isAuthReady } = useAuth();
  const navigate = useNavigate();
  
  // Force admin status check when component mounts
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user && isAuthReady) {
        console.log("Authenticated view - checking admin status for:", user.email);
        await refreshAdminStatus();
      }
    };
    
    checkAdminStatus();
  }, [user, refreshAdminStatus, isAuthReady]);
  
  const handleLogout = async () => {
    try {
      await signOut();
      // Force page refresh after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-green-500" />
            Welcome Back!
          </CardTitle>
          <CardDescription>
            You're now logged in as {user?.email}
            {isAdmin && <span className="ml-2 font-semibold text-purple-600">(Admin)</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Button 
            onClick={() => navigate('/')}
            variant="default"
            className="w-full flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go to Home Page
          </Button>
          
          {isAdmin && (
            <Button 
              onClick={() => navigate('/admin')}
              variant="default"
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Button>
          )}
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
