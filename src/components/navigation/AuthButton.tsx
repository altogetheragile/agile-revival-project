
import { Link } from 'react-router-dom';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { useNavAuth } from '@/hooks/useNavAuth';

interface AuthButtonProps {
  closeMenu?: () => void;
  isMobile?: boolean;
}

export const AuthButton = ({ closeMenu, isMobile }: AuthButtonProps) => {
  const { user, isAdmin } = useNavAuth();
  
  console.log("AuthButton - Rendering:", { 
    userEmail: user?.email, 
    isAdmin,
    provider: user?.app_metadata?.provider,
    isUserDefined: !!user
  });
  
  // Always render the Admin Dashboard link if user is admin
  if (user && isAdmin) {
    console.log(`AuthButton - Showing Admin link for admin user: ${user.email} (${user.app_metadata?.provider || 'email'})`);
    return (
      <Link 
        to="/admin" 
        className={isMobile 
          ? "text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors bg-yellow-100" 
          : navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple bg-yellow-100"}
        onClick={() => {
          console.log("Admin Dashboard link clicked");
          closeMenu?.();
        }}
      >
        Admin Dashboard
      </Link>
    );
  }
  
  // Render My Account link for authenticated users (who are not admins)
  if (user) {
    return (
      <Link 
        to="/auth" 
        className={isMobile 
          ? "text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors" 
          : navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple"}
        onClick={closeMenu}
      >
        My Account
      </Link>
    );
  }
  
  // Default case - show Login link for unauthenticated users
  return (
    <Link 
      to="/auth" 
      className={isMobile 
        ? "text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors" 
        : navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple"}
      onClick={closeMenu}
    >
      Login
    </Link>
  );
};
