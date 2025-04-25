
import { X, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthButton } from '../navigation/AuthButton';
import { ShieldCheck, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MobileNavProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  handleHashLinkClick: (id: string) => void;
  handleFullPageLinkClick: () => void;
  isAdmin?: boolean;
  userEmail?: string;
}

const MobileNav = ({ 
  isMenuOpen, 
  toggleMenu, 
  closeMenu,
  handleHashLinkClick,
  handleFullPageLinkClick,
  isAdmin,
  userEmail
}: MobileNavProps) => {
  return (
    <div className="md:hidden">
      <button
        className="p-2 text-gray-700 hover:text-agile-purple focus:outline-none"
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
      
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex justify-end p-4">
            <button
              className="p-2 text-gray-700 hover:text-agile-purple focus:outline-none"
              onClick={closeMenu}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex flex-col items-center space-y-6 p-4 mt-8">
            {/* User Authentication Status (Mobile) */}
            {userEmail && (
              <div className="flex flex-col items-center gap-2 mb-4 text-center">
                <div className="flex items-center">
                  <UserCircle className="h-5 w-5 mr-1 text-gray-600" />
                  <span className="text-gray-700">{userEmail}</span>
                </div>
                
                {isAdmin && (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Admin
                  </Badge>
                )}
              </div>
            )}
          
            <Link
              to="/"
              className="text-gray-700 hover:text-agile-purple font-medium"
              onClick={handleFullPageLinkClick}
            >
              Home
            </Link>
            
            <Link
              to="/training-schedule"
              className="text-gray-700 hover:text-agile-purple font-medium"
              onClick={closeMenu}
            >
              Training
            </Link>
            
            {/* Link with hash - scrolls to section on home page */}
            <button
              className="text-gray-700 hover:text-agile-purple font-medium"
              onClick={() => handleHashLinkClick('services')}
            >
              Services
            </button>
            
            <Link
              to="/blog"
              className="text-gray-700 hover:text-agile-purple font-medium"
              onClick={closeMenu}
            >
              Blog
            </Link>
            
            <button
              className="text-gray-700 hover:text-agile-purple font-medium"
              onClick={() => handleHashLinkClick('about')}
            >
              About
            </button>
            
            <button
              className="text-gray-700 hover:text-agile-purple font-medium"
              onClick={() => handleHashLinkClick('contact')}
            >
              Contact
            </button>
            
            <AuthButton closeMenu={closeMenu} isMobile={true} />
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className="bg-purple-100 text-purple-800 px-4 py-2 rounded-md flex items-center gap-1"
                onClick={closeMenu}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
