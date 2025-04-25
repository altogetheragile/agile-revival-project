
import { Link } from 'react-router-dom';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

interface AuthButtonProps {
  closeMenu?: () => void;
  isMobile?: boolean;
}

export const AuthButton = ({ closeMenu, isMobile }: AuthButtonProps) => {
  // Simplified version with admin access for demo
  return (
    <Link 
      to="/admin" 
      className={isMobile 
        ? "text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors" 
        : navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple"}
      onClick={closeMenu}
    >
      Admin Dashboard (Demo)
    </Link>
  );
};
