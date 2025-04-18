
import { Link, useLocation } from 'react-router-dom';
import { 
  NavigationMenuItem,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { useAuth } from '@/contexts/AuthContext';

type NavLinkProps = {
  name: string;
  href: string;
  isHash?: boolean;
  isAdmin?: boolean;
  handleHashLinkClick: (elementId: string) => void;
  handleFullPageLinkClick: () => void;
};

const NavLink = ({ 
  name, 
  href, 
  isHash, 
  handleHashLinkClick, 
  handleFullPageLinkClick 
}: NavLinkProps) => {
  const location = useLocation();

  if (isHash && location.pathname === '/') {
    return (
      <button
        onClick={() => handleHashLinkClick(href.split('#')[1])}
        className={navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple"}
      >
        {name}
      </button>
    );
  }

  return (
    <Link
      to={href}
      onClick={isHash ? undefined : handleFullPageLinkClick}
      className={navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple"}
    >
      {name}
    </Link>
  );
};

export const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/#services', isHash: true },
  { name: 'About Us', href: '/#about', isHash: true },
  { name: 'Training', href: '/training-schedule' },
  { name: 'Blog', href: '/blog' },
  { name: 'Testimonials', href: '/#testimonials', isHash: true },
  { name: 'Contact', href: '/#contact', isHash: true },
];

type NavLinksProps = {
  handleHashLinkClick: (elementId: string) => void;
  handleFullPageLinkClick: () => void;
  closeMenu?: () => void;
  isMobile?: boolean;
};

const NavLinks = ({ 
  handleHashLinkClick, 
  handleFullPageLinkClick, 
  closeMenu,
  isMobile = false
}: NavLinksProps) => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  
  // Display all navigation links without filtering
  const filteredNavLinks = navLinks;

  const GetStartedButton = () => {
    if (location.pathname === '/') {
      return (
        <button 
          onClick={() => {
            handleHashLinkClick('contact'); 
            closeMenu?.();
          }}
          className="cta-button py-2 px-4"
        >
          Get Started
        </button>
      );
    }
    
    return (
      <Link 
        to="/#contact" 
        className="cta-button py-2 px-4"
        onClick={closeMenu}
      >
        Get Started
      </Link>
    );
  };

  const AuthButton = () => {
    if (user) {
      return (
        isAdmin ? (
          <Link 
            to="/admin" 
            className={isMobile 
              ? "text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors" 
              : navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple"}
            onClick={closeMenu}
          >
            Admin Dashboard
          </Link>
        ) : null
      );
    }

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

  if (isMobile) {
    return (
      <>
        {filteredNavLinks.map((link) => (
          link.isHash && location.pathname === '/' ? (
            <button
              key={link.name}
              onClick={() => {
                handleHashLinkClick(link.href.split('#')[1]);
                closeMenu?.();
              }}
              className="text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors text-left"
            >
              {link.name}
            </button>
          ) : (
            <Link
              key={link.name}
              to={link.href}
              className="text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors"
              onClick={() => {
                link.isHash ? closeMenu?.() : handleFullPageLinkClick();
                closeMenu?.();
              }}
            >
              {link.name}
            </Link>
          )
        ))}
        <AuthButton />
        <GetStartedButton />
      </>
    );
  }

  return (
    <>
      {filteredNavLinks.map((link) => (
        <NavigationMenuItem key={link.name}>
          <NavLink 
            {...link} 
            handleHashLinkClick={handleHashLinkClick}
            handleFullPageLinkClick={handleFullPageLinkClick}
          />
        </NavigationMenuItem>
      ))}
      <NavigationMenuItem>
        <AuthButton />
      </NavigationMenuItem>
      <NavigationMenuItem>
        <GetStartedButton />
      </NavigationMenuItem>
    </>
  );
};

export default NavLinks;
