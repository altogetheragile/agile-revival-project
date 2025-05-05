
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useDevMode } from '@/contexts/DevModeContext';

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
  const { devMode } = useDevMode();
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
    devMode
  });

  // If dev mode is enabled, bypass all checks
  useEffect(() => {
    if (devMode) {
      console.log("[ProtectedRoute Debug] Dev mode enabled, bypassing security checks");
      setIsCheckingRole(false);
      setHasRequiredRole(true);
      setCheckComplete(true);
      return;
    }

    // Check if the user has any of the required roles
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

    // For admin routes, refresh the admin status first
    const checkRoles = async () => {
      let adminStatus = isAdmin;
      
      // If admin role is required, try refreshing the status
      if (requiredRoles.includes('admin')) {
        try {
          console.log("[ProtectedRoute Debug] Refreshing admin status for user:", user.id);
          adminStatus = await refreshAdminStatus(user.id);
          console.log("[ProtectedRoute Debug] Refreshed admin status:", adminStatus);
        } catch (error) {
          console.error("[ProtectedRoute Debug] Error refreshing admin status:", error);
        }
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
    };
    
    checkRoles();
  }, [user, isAdmin, requiredRoles, refreshAdminStatus, devMode]);

  // Show toast notification when redirected due to admin access restriction
  useEffect(() => {
    if (!devMode && checkComplete && requiredRoles.includes('admin') && !hasRequiredRole && user) {
      console.log("[ProtectedRoute Debug] Showing access denied toast");
      toast.error("Access denied", {
        description: "You need admin privileges to access this area",
        duration: 5000,
      });
    }
  }, [checkComplete, requiredRoles, hasRequiredRole, user, devMode]);

  // Log the final decision for debugging
  useEffect(() => {
    if (checkComplete) {
      console.log("[ProtectedRoute Debug] Access decision:", {
        devMode,
        hasRequiredRole,
        isAdmin,
        requiredRoles,
        shouldRedirect: !devMode && (!user || (requiredRoles.length > 0 && !hasRequiredRole && !isAdmin))
      });
    }
  }, [checkComplete, hasRequiredRole, isAdmin, requiredRoles, user, devMode]);

  // Show loading state while checking authentication
  if (!devMode && (!isAuthReady || isCheckingRole)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-agile-purple" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // When dev mode is enabled, always render the children
  if (devMode) {
    return <>{children}</>;
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
