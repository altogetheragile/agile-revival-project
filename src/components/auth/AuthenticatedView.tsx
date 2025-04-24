
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, LogOut, LayoutDashboard, UserCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthenticatedView() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await signOut();
      // Force page refresh after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAdminDashboard = () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-green-500" />
            Welcome {user?.email}
          </CardTitle>
          <CardDescription>
            You're now viewing a simplified page without authentication.
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
          
          <Button 
            onClick={handleAdminDashboard}
            variant={isAdmin ? "default" : "outline"}
            className={`w-full flex items-center justify-center gap-2 ${isAdmin ? "bg-purple-600 hover:bg-purple-700" : "text-gray-500"}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Admin Dashboard
          </Button>
          
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
