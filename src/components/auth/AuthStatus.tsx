
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShieldCheck, LogIn, UserCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AuthStatusProps {
  className?: string;
}

const AuthStatus = ({ className = '' }: AuthStatusProps) => {
  const { user, isAdmin, isAuthReady, signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      // Force navigation to home page
      window.location.href = '/';
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };
  
  if (!isAuthReady) {
    return null;
  }
  
  if (!user) {
    return (
      <Card className={`border-blue-100 bg-blue-50 ${className}`}>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-blue-600" />
            <span className="text-blue-700">You are not logged in</span>
          </div>
          <Button asChild variant="outline" className="bg-white">
            <Link to="/auth">Login or Register</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`${isAdmin ? 'border-purple-100 bg-purple-50' : 'border-green-100 bg-green-50'} ${className}`}>
      <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <ShieldCheck className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-900">Admin:</span>
            </>
          ) : (
            <>
              <UserCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900">User:</span>
            </>
          )}
          <span className={isAdmin ? "text-purple-700" : "text-green-700"}>
            {user.email}
          </span>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button asChild variant="outline" className="bg-white border-purple-200 text-purple-700 hover:bg-purple-100">
              <Link to="/admin">Admin Dashboard</Link>
            </Button>
          )}
          <Button 
            variant="outline" 
            className="bg-white border-red-200 text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthStatus;
