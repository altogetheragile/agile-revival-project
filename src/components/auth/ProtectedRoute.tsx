
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
  const { user, isAdmin, isAuthReady } = useAuth();
  const location = useLocation();
  const [isCheckingRole, setIsCheckingRole] = useState(requiredRoles.length > 0);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);

  // Check if the user has any of the required roles
  useEffect(() => {
    if (!requiredRoles.length) {
      setIsCheckingRole(false);
      return;
    }

    if (!user) {
      setIsCheckingRole(false);
      return;
    }

    // Admin users always have access to everything
    if (isAdmin) {
      setHasRequiredRole(true);
      setIsCheckingRole(false);
      return;
    }

    // For other role checks, we would check user roles here
    // This is a placeholder for future role checking logic
    const userHasRequiredRole = requiredRoles.includes('user');
    setHasRequiredRole(userHasRequiredRole);
    setIsCheckingRole(false);
  }, [user, isAdmin, requiredRoles]);

  // Show loading state while checking authentication
  if (!isAuthReady || isCheckingRole) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Redirect to unauthorized page if missing required role
  if (requiredRoles.length > 0 && !hasRequiredRole && !isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
}
