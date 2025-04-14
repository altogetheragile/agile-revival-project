
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'About Us', href: '/#about' },
    { name: 'Training', href: '/training-schedule' },
    { name: 'Blog', href: '/blog' },
    { name: 'Testimonials', href: '/#testimonials' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Admin', href: '/admin', isAdmin: true } // Added admin link with flag
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
        <div className="hidden md:flex space-x-8">
          {filteredNavLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href.startsWith('/#') ? link.href.substring(1) : link.href}
              className="text-gray-700 hover:text-agile-purple font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link to="/#contact" className="cta-button py-2 px-4">
            Get Started
          </Link>
        </div>
        
        {/* Mobile Navigation Toggle */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 p-4 flex flex-col space-y-4 animate-fade-in">
          {filteredNavLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href.startsWith('/#') ? link.href.substring(1) : link.href}
              className="text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/#contact" className="cta-button text-center" onClick={() => setIsMenuOpen(false)}>
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
