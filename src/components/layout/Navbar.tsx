
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';

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
    } else if (location.pathname === '/') {
      // Scroll to top when on home page without hash
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

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services', isHash: true },
    { name: 'About Us', href: '/#about', isHash: true },
    { name: 'Training', href: '/training-schedule' },
    { name: 'Blog', href: '/blog' },
    { name: 'Testimonials', href: '/#testimonials', isHash: true },
    { name: 'Contact', href: '/#contact', isHash: true },
    { name: 'Admin', href: '/admin', isAdmin: true }
  ];

  // In a real application, this would come from your authentication system
  const isAdmin = true; // Placeholder - replace with actual auth check

  // Filter navigation links based on user role
  const filteredNavLinks = navLinks.filter(link => 
    !link.isAdmin || (link.isAdmin && isAdmin)
  );

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-2xl text-agile-purple">
          Altogether<span className="text-agile-purple-dark">Agile</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {filteredNavLinks.map((link) => (
                <NavigationMenuItem key={link.name}>
                  {link.isHash && location.pathname === '/' ? (
                    <button
                      onClick={() => handleHashLinkClick(link.href.split('#')[1])}
                      className={navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple"}
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className={navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple"}
                    >
                      {link.name}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                {location.pathname === '/' ? (
                  <button 
                    onClick={() => handleHashLinkClick('contact')} 
                    className="cta-button py-2 px-4"
                  >
                    Get Started
                  </button>
                ) : (
                  <Link 
                    to="/#contact" 
                    className="cta-button py-2 px-4"
                  >
                    Get Started
                  </Link>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 p-4 flex flex-col space-y-4 animate-fade-in">
          {filteredNavLinks.map((link) => (
            link.isHash && location.pathname === '/' ? (
              <button
                key={link.name}
                onClick={() => handleHashLinkClick(link.href.split('#')[1])}
                className="text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors text-left"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors"
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            )
          ))}
          {location.pathname === '/' ? (
            <button 
              onClick={() => handleHashLinkClick('contact')} 
              className="cta-button text-center py-2"
            >
              Get Started
            </button>
          ) : (
            <Link 
              to="/#contact" 
              className="cta-button text-center py-2" 
              onClick={closeMenu}
            >
              Get Started
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
