
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('ProtectedRoute auth check:', { user, isAdmin });
    
    if (!user) {
      console.log('No user, redirecting to auth');
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
  }, [user, isAdmin, navigate, toast]);

  // Only render children if user exists and is admin
  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
