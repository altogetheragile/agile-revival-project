
import { Link, useLocation } from 'react-router-dom';
import { 
  NavigationMenuItem,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

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
  const { user, isAdmin, refreshAdminStatus, isAuthReady } = useAuth();
  const [adminStatusChecked, setAdminStatusChecked] = useState(false);
  
  // Force admin status check when component mounts or auth state changes
  useEffect(() => {
    let isMounted = true;
    
    const checkAdminStatus = async () => {
      // Only check if we have a user and auth is ready
      if (user?.id && isAuthReady) {
        const isGoogleAuth = user.app_metadata?.provider === 'google';
        console.log(`NavLinks - Checking admin status for ${user.email} (${user.app_metadata?.provider || 'email'})`);
        
        try {
          // Give a shorter delay for Google auth
          const checkDelay = isGoogleAuth ? 0 : 100;
          
          setTimeout(async () => {
            if (!isMounted) return;
            
            // Always force a refresh of admin status
            const refreshedAdminStatus = await refreshAdminStatus();
            
            if (isMounted) {
              console.log(`NavLinks - Admin status refreshed: ${refreshedAdminStatus ? 'admin' : 'not admin'} for ${user.email} (${user.app_metadata?.provider || 'email'})`);
              setAdminStatusChecked(true);
            }
          }, checkDelay);
        } catch (error) {
          console.error("NavLinks - Error checking admin status:", error);
          if (isMounted) setAdminStatusChecked(true); // Mark as checked even on error
        }
      } else if (!user) {
        setAdminStatusChecked(false);
      }
    };
    
    // Always run the check when component mounts if there's a user
    checkAdminStatus();
    
    return () => {
      isMounted = false;
    };
  }, [user, isAuthReady, refreshAdminStatus]);

  // Additionally check admin status when the provider might be 'google'
  useEffect(() => {
    if (user?.app_metadata?.provider === 'google' && isAuthReady) {
      console.log('NavLinks - Detected Google auth, force-checking admin status');
      refreshAdminStatus();
    }
  }, [user?.app_metadata?.provider, isAuthReady, refreshAdminStatus]);

  // Reset admin check status on user change
  useEffect(() => {
    setAdminStatusChecked(false);
  }, [user?.id]);
  
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
    console.log("NavLinks - Rendering AuthButton:", { 
      userEmail: user?.email, 
      isAdmin, 
      isAuthReady,
      provider: user?.app_metadata?.provider
    });
    
    if (user && isAdmin) {
      console.log(`NavLinks - Showing Admin link for admin user: ${user.email} (${user.app_metadata?.provider || 'email'})`);
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

  // For debugging admin status
  useEffect(() => {
    if (user?.id) {
      console.log(`NavLinks - Admin status for ${user.email}: ${isAdmin ? 'ADMIN' : 'not admin'}, provider: ${user.app_metadata?.provider || 'email'}`);
    }
  }, [isAdmin, user]);

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
        {user && isAdmin && (
          <Link 
            to="/admin"
            className="text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors bg-yellow-100"
            onClick={closeMenu}
          >
            Admin Dashboard
          </Link>
        )}
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
