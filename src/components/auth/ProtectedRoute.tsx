
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  redirectTo = "/auth" 
}: ProtectedRouteProps) {
  const { user, isAdmin, isAuthReady } = useAuth();
  const location = useLocation();
  const [isCheckingRole, setIsCheckingRole] = useState(requiredRoles.length > 0);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  // Check if the user has any of the required roles
  useEffect(() => {
    if (!requiredRoles.length) {
      setIsCheckingRole(false);
      setCheckComplete(true);
      return;
    }

    if (!user) {
      setIsCheckingRole(false);
      setCheckComplete(true);
      return;
    }

    // Admin users always have access to everything
    if (isAdmin) {
      setHasRequiredRole(true);
      setIsCheckingRole(false);
      setCheckComplete(true);
      return;
    }

    // For other role checks, we would check user roles here
    // This is a placeholder for future role checking logic
    const userHasRequiredRole = requiredRoles.includes('user');
    setHasRequiredRole(userHasRequiredRole);
    setIsCheckingRole(false);
    setCheckComplete(true);
  }, [user, isAdmin, requiredRoles]);

  // Show toast notification when redirected due to admin access restriction
  useEffect(() => {
    if (checkComplete && requiredRoles.includes('admin') && !isAdmin && user) {
      toast.error("Access denied", {
        description: "You need admin privileges to access this area",
        duration: 5000,
      });
    }
  }, [checkComplete, requiredRoles, isAdmin, user]);

  // Show loading state while checking authentication
  if (!isAuthReady || isCheckingRole) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-agile-purple" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Redirect to unauthorized page if missing required role
  if (requiredRoles.length > 0 && !hasRequiredRole && !isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
}
