
import { Link } from 'react-router-dom';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

interface AuthButtonProps {
  closeMenu?: () => void;
  isMobile?: boolean;
}

export const AuthButton = ({ closeMenu, isMobile }: AuthButtonProps) => {
  const { user, isAdmin, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle logout
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("Logged out successfully");
      
      // Force navigation to home page
      window.location.href = '/';
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out", {
        description: "Please try again or refresh the page"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (user) {
    // User is authenticated - show profile and logout
    return (
      <>
        {isAdmin && !isMobile && (
          <Link 
            to="/admin" 
            className={navigationMenuTriggerStyle() + 
              " bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center gap-1 mr-2"}
            onClick={closeMenu}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </Link>
        )}
        
        <Button
          variant="outline"
          className={isMobile 
            ? "text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 font-medium py-2 px-4" 
            : "bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200"}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4 mr-1" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </>
    );
  }

  // User is not authenticated - show login link
  return (
    <Link 
      to="/auth" 
      className={isMobile 
        ? "text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors" 
        : navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple"}
      onClick={closeMenu}
    >
      <UserCircle className="h-4 w-4 mr-1" />
      Login / Register
    </Link>
  );
};
