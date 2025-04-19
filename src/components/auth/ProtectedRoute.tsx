
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('ProtectedRoute auth check started:', { 
        user: user?.email, 
        isAdmin, 
        userId: user?.id 
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
        
        if (!isAdmin) {
          console.log('User not admin, showing toast and redirecting');
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
    
    checkAuth();
  }, [user, isAdmin, navigate, toast]);

  // Show nothing while checking auth status
  if (isChecking) {
    return null;
  }

  // Only render children if user exists and is admin
  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
