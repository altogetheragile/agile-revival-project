
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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

  // In a real application, this would come from your authentication system
  const isAdmin = true; // Placeholder - replace with actual auth check

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
          Altogether<span className="text-agile-purple-dark">Agile</span>
        </Link>
        
        {/* Desktop Navigation */}
        <DesktopNav 
          handleHashLinkClick={handleHashLinkClick}
          handleFullPageLinkClick={handleFullPageLinkClick}
          isAdmin={isAdmin}
        />
        
        {/* Mobile Navigation */}
        <MobileNav 
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          closeMenu={closeMenu}
          handleHashLinkClick={handleHashLinkClick}
          handleFullPageLinkClick={handleFullPageLinkClick}
          isAdmin={isAdmin}
        />
      </div>
    </nav>
  );
};

export default Navbar;
