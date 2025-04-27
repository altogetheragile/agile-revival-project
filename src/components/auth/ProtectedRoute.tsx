
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
  const { user, isAdmin, isAuthReady, checkUserRole } = useAuth();
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

    // Check for specific roles
    const checkRoles = async () => {
      try {
        // For each required role, check if the user has it
        const roleChecks = await Promise.all(
          requiredRoles.map(role => checkUserRole(user.id, role))
        );
        
        // User has access if they have any of the required roles
        const userHasRequiredRole = roleChecks.some(hasRole => hasRole);
        setHasRequiredRole(userHasRequiredRole);
      } catch (error) {
        console.error("Error checking user roles:", error);
        setHasRequiredRole(false);
      } finally {
        setIsCheckingRole(false);
        setCheckComplete(true);
      }
    };

    checkRoles();
  }, [user, isAdmin, requiredRoles, checkUserRole]);

  // Show toast notification when redirected due to access restriction
  useEffect(() => {
    if (checkComplete && requiredRoles.length > 0 && !hasRequiredRole && user) {
      toast.error("Access denied", {
        description: "You don't have permission to access this area",
        duration: 5000,
      });
    }
  }, [checkComplete, requiredRoles, hasRequiredRole, user]);

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
