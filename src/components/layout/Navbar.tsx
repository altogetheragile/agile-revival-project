
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { useSiteSettings } from '@/contexts/site-settings';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { UserCircle, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings, isLoading } = useSiteSettings();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle hash navigation when route changes
  useEffect(() => {
    // Check if the URL contains a hash
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Scroll to top when on any page without hash
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleHashLinkClick = (elementId: string) => {
    closeMenu();
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFullPageLinkClick = () => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Use siteName from settings, or fall back to the default if not loaded yet
  const siteName = settings.general?.siteName || "AltogetherAgile";
  
  // Custom logic to color the site name:
  let siteNameContent = null;
  if (siteName.includes(' ')) {
    // Two word mode (use mid-light green for second word)
    const [firstPart, ...rest] = siteName.split(' ');
    siteNameContent = (
      <>
        {firstPart}
        <span className="text-agile-mid-light"> {rest.join(' ')}</span>
      </>
    );
  } else {
    // No space: split camel case like "AltogetherAgile"
    const match = siteName.match(/^([A-Z][a-z]+)([A-Z].+)$/);
    if (match) {
      siteNameContent = (
        <>
          {match[1]}
          <span className="text-agile-purple-dark">{match[2]}</span>
        </>
      );
    } else {
      // Fallback to base color
      siteNameContent = siteName;
    }
  }

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="font-bold text-2xl text-agile-purple"
          onClick={handleFullPageLinkClick}
        >
          {siteNameContent}
        </Link>
        
        {/* User Authentication Status */}
        {user && (
          <div className="hidden md:flex items-center gap-2 text-sm mr-4">
            <div className="flex items-center">
              <UserCircle className="h-4 w-4 mr-1 text-gray-600" />
              <span className="text-gray-700">{user.email}</span>
            </div>
            
            {isAdmin && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>
        )}
        
        {/* Desktop Navigation */}
        <DesktopNav 
          handleHashLinkClick={handleHashLinkClick}
          handleFullPageLinkClick={handleFullPageLinkClick}
        />
        
        {/* Mobile Navigation */}
        <MobileNav 
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          closeMenu={closeMenu}
          handleHashLinkClick={handleHashLinkClick}
          handleFullPageLinkClick={handleFullPageLinkClick}
          isAdmin={isAdmin}
          userEmail={user?.email}
        />
      </div>
    </nav>
  );
};

export default Navbar;
