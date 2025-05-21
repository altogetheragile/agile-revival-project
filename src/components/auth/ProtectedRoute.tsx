
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, isAdmin, isLoading, isAuthReady, refreshAdminStatus } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (user && adminOnly) {
        // If admin access required, refresh the status to be sure
        // This uses the optimized check_user_role function internally
        await refreshAdminStatus(user.id);
      }
      setIsChecking(false);
    };

    if (!isLoading && isAuthReady) {
      checkAccess();
    }
  }, [user, isAdmin, isLoading, isAuthReady, adminOnly, refreshAdminStatus]);

  if (isLoading || isChecking) {
    // You could return a loading spinner here
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect to unauthorized page if admin access required but user is not admin
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
