
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, refreshAdminStatus, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('ProtectedRoute auth check started:', { 
        user: user?.email, 
        isAdmin, 
        userId: user?.id,
        isAuthReady
      });
      
      try {
        if (!user) {
          console.log('No user, redirecting to auth');
          toast({
            title: "Authentication required",
            description: "Please login to continue.",
          });
          navigate('/auth');
          return;
        } 
        
        console.log('User found, refreshing admin status');
        // Force a refresh of admin status
        const isUserAdmin = await refreshAdminStatus(); // Store the boolean result
        console.log('Admin status refresh result:', isUserAdmin);
        
        // After refreshing, check admin status
        if (!isUserAdmin) {
          console.log('User not admin after refresh, showing toast and redirecting');
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        console.log('Auth check passed, user is admin');
      } catch (error) {
        console.error('Auth check error:', error);
        toast({
          title: "Authentication Error",
          description: "There was a problem verifying your access.",
          variant: "destructive",
        });
        navigate('/auth');
      } finally {
        setIsChecking(false);
      }
    };
    
    if (isAuthReady) {
      checkAuth();
    }
  }, [user, isAdmin, navigate, toast, refreshAdminStatus, isAuthReady]);

  // Show loading indicator while checking auth status
  if (isChecking || !isAuthReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-agile-purple" />
        <span className="ml-2 text-lg">Verifying access...</span>
      </div>
    );
  }

  // Only render children if user exists and is admin
  return <>{children}</>;
}
