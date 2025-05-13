
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
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
  const { user, isAdmin, isAuthReady, refreshAdminStatus } = useAuth();
  const location = useLocation();
  const [isCheckingRole, setIsCheckingRole] = useState(requiredRoles.length > 0);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  // Add debug logging
  console.log("[ProtectedRoute Debug] Initial state:", { 
    user: !!user, 
    userId: user?.id,
    isAdmin, 
    isAuthReady, 
    requiredRoles,
    isCheckingRole,
    pathname: location.pathname
  });

  // Check if the user has any of the required roles
  useEffect(() => {
    if (!requiredRoles.length) {
      console.log("[ProtectedRoute Debug] No required roles, skipping check");
      setIsCheckingRole(false);
      setCheckComplete(true);
      return;
    }

    if (!user) {
      console.log("[ProtectedRoute Debug] No user, skipping role check");
      setIsCheckingRole(false);
      setCheckComplete(true);
      return;
    }

    // For admin routes, refresh the admin status first but only if needed
    // (avoid excessive refreshing that could cause performance issues)
    const checkRoles = async () => {
      try {
        let adminStatus = isAdmin;
        
        // Only refresh admin status if we're on an admin route and admin status isn't true
        if (requiredRoles.includes('admin') && !isAdmin) {
          console.log("[ProtectedRoute Debug] Refreshing admin status for user:", user.id);
          adminStatus = await refreshAdminStatus(user.id);
          console.log("[ProtectedRoute Debug] Refreshed admin status:", adminStatus);
        } else if (isAdmin) {
          console.log("[ProtectedRoute Debug] Using cached admin status:", isAdmin);
        }
        
        // Admin users always have access to everything
        if (adminStatus) {
          console.log("[ProtectedRoute Debug] User is admin, granting access");
          setHasRequiredRole(true);
          setIsCheckingRole(false);
          setCheckComplete(true);
          return;
        }
        
        // For other role checks, we would check user roles here
        // This is a placeholder for future role checking logic
        const userHasRequiredRole = requiredRoles.includes('user');
        console.log("[ProtectedRoute Debug] User role check result:", userHasRequiredRole);
        
        setHasRequiredRole(userHasRequiredRole);
        setIsCheckingRole(false);
        setCheckComplete(true);
      } catch (error) {
        console.error("[ProtectedRoute Debug] Error checking roles:", error);
        setIsCheckingRole(false);
        setHasRequiredRole(false);
        setCheckComplete(true);
        
        // Updated toast message now that we've fixed the database function
        toast.error("Role verification error", {
          description: "Unable to verify your permissions. Try refreshing the page.",
          duration: 8000
        });
      }
    };
    
    checkRoles();
  }, [user, isAdmin, requiredRoles, refreshAdminStatus, location.pathname]);

  // Show toast notification when redirected due to admin access restriction
  useEffect(() => {
    if (checkComplete && requiredRoles.includes('admin') && !hasRequiredRole && user) {
      console.log("[ProtectedRoute Debug] Showing access denied toast");
      toast.error("Access denied", {
        description: "You need admin privileges to access this area.",
        duration: 5000,
      });
    }
  }, [checkComplete, requiredRoles, hasRequiredRole, user]);

  // Log the final decision for debugging
  useEffect(() => {
    if (checkComplete) {
      console.log("[ProtectedRoute Debug] Access decision:", {
        hasRequiredRole,
        isAdmin,
        requiredRoles,
        shouldRedirect: (!user || (requiredRoles.length > 0 && !hasRequiredRole && !isAdmin))
      });
    }
  }, [checkComplete, hasRequiredRole, isAdmin, requiredRoles, user]);

  // Show loading state while checking authentication but with a shorter delay
  if (!isAuthReady || isCheckingRole) {
    // Simplified loading UI to reduce render complexity
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-agile-purple" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("[ProtectedRoute Debug] No user, redirecting to:", redirectTo);
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Redirect to unauthorized page if missing required role
  if (requiredRoles.length > 0 && !hasRequiredRole && !isAdmin) {
    console.log("[ProtectedRoute Debug] Missing role, redirecting to unauthorized");
    return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
  }

  // If all checks pass, render the children
  console.log("[ProtectedRoute Debug] All checks passed, rendering protected content");
  return <>{children}</>;
}
