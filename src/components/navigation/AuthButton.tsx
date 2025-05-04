
import { Link } from 'react-router-dom';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User, Shield } from 'lucide-react';
import { useEffect } from 'react';

interface AuthButtonProps {
  closeMenu?: () => void;
  isMobile?: boolean;
}

export const AuthButton = ({ closeMenu, isMobile }: AuthButtonProps) => {
  const { user, isAdmin, signOut } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log("[AuthButton Debug] Auth state:", { 
      user: !!user, 
      userId: user?.id,
      isAdmin 
    });
  }, [user, isAdmin]);

  // Handle logout
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      closeMenu?.();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // When not logged in - show login button
  if (!user) {
    return (
      <Link 
        to="/auth" 
        className={isMobile 
          ? "text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors flex items-center gap-2" 
          : navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple flex items-center gap-2"}
        onClick={closeMenu}
      >
        <LogIn size={18} /> Login
      </Link>
    );
  }

  // When logged in as admin - show admin dashboard link
  if (isAdmin) {
    console.log("[AuthButton Debug] Showing admin dashboard link");
    return (
      <div className={isMobile ? "space-y-2" : "flex items-center gap-2"}>
        <Link 
          to="/admin" 
          className={isMobile 
            ? "text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors flex items-center gap-2" 
            : navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple flex items-center gap-2"}
          onClick={closeMenu}
        >
          <Shield size={18} className="text-agile-purple" /> Admin Dashboard
        </Link>
        <Button 
          variant="ghost" 
          className={isMobile 
            ? "text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors w-full justify-start"
            : "text-gray-700 hover:text-agile-purple"}
          onClick={handleLogout}
        >
          <LogOut size={18} /> Logout
        </Button>
      </div>
    );
  }

  // When logged in as regular user - show account menu
  return (
    <div className={isMobile ? "space-y-2" : "flex items-center gap-2"}>
      <Link 
        to="/account" 
        className={isMobile 
          ? "text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors flex items-center gap-2" 
          : navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple flex items-center gap-2"}
        onClick={closeMenu}
      >
        <User size={18} /> My Account
      </Link>
      <Button 
        variant="ghost" 
        className={isMobile 
          ? "text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors w-full justify-start"
          : "text-gray-700 hover:text-agile-purple"}
        onClick={handleLogout}
      >
        <LogOut size={18} /> Logout
      </Button>
    </div>
  );
};
