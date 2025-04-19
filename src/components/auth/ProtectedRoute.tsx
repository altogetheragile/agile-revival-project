
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
    let isMounted = true;
    
    const checkAuth = async () => {
      console.log('ProtectedRoute - Auth check started:', { 
        user: user?.email, 
        isAdmin, 
        userId: user?.id,
        isAuthReady
      });
      
      // Only proceed if authentication is ready
      if (!isAuthReady) {
        console.log('ProtectedRoute - Auth not ready yet, waiting...');
        return;
      }
      
      try {
        if (!user) {
          console.log('ProtectedRoute - No user, redirecting to auth');
          toast({
            title: "Authentication required",
            description: "Please login to continue.",
          });
          navigate('/auth');
          return;
        } 
        
        console.log('ProtectedRoute - User found, refreshing admin status');
        // Force a refresh of admin status with setTimeout to prevent deadlock
        let isUserAdmin = false;
        setTimeout(async () => {
          isUserAdmin = await refreshAdminStatus();
          console.log('ProtectedRoute - Admin status refresh result:', isUserAdmin);
          
          if (!isMounted) return;
          
          // After refreshing, check admin status
          if (!isUserAdmin) {
            console.log('ProtectedRoute - User not admin after refresh, redirecting');
            toast({
              title: "Access Denied",
              description: "You don't have permission to access this page.",
              variant: "destructive",
            });
            navigate('/');
          } else {
            console.log('ProtectedRoute - Auth check passed, user is admin');
          }
          
          setIsChecking(false);
        }, 0);
      } catch (error) {
        console.error('Auth check error:', error);
        if (isMounted) {
          toast({
            title: "Authentication Error",
            description: "There was a problem verifying your access.",
            variant: "destructive",
          });
          navigate('/auth');
          setIsChecking(false);
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
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
