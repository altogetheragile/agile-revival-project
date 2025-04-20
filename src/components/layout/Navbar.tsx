
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { useSiteSettings } from '@/contexts/site-settings';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings, isLoading } = useSiteSettings();

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
  
  // Split the site name for styling if it contains two words
  const nameParts = siteName.split(/\s+/);
  const firstPart = nameParts[0] || "";
  const remainingParts = nameParts.slice(1).join(" ");

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
          {firstPart}
          {remainingParts && (
            <span className="text-agile-purple-light"> {remainingParts}</span>
          )}
        </Link>
        
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
        />
      </div>
    </nav>
  );
};

export default Navbar;
