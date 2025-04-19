
import { NavigationMenuItem } from '@/components/ui/navigation-menu';
import { NavLink } from '@/components/navigation/NavLink';
import { AuthButton } from '@/components/navigation/AuthButton';
import { GetStartedButton } from '@/components/navigation/GetStartedButton';

export const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/#services', isHash: true },
  { name: 'About Us', href: '/#about', isHash: true },
  { name: 'Training', href: '/training-schedule' },
  { name: 'Blog', href: '/blog' },
  { name: 'Testimonials', href: '/#testimonials', isHash: true },
  { name: 'Contact', href: '/#contact', isHash: true },
];

interface NavLinksProps {
  handleHashLinkClick: (elementId: string) => void;
  handleFullPageLinkClick: () => void;
  closeMenu?: () => void;
  isMobile?: boolean;
}

const NavLinks = ({ 
  handleHashLinkClick, 
  handleFullPageLinkClick, 
  closeMenu,
  isMobile = false
}: NavLinksProps) => {
  if (isMobile) {
    return (
      <>
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            {...link}
            handleHashLinkClick={handleHashLinkClick}
            handleFullPageLinkClick={handleFullPageLinkClick}
            closeMenu={closeMenu}
            isMobile={true}
          />
        ))}
        <AuthButton closeMenu={closeMenu} isMobile={true} />
        <GetStartedButton 
          handleHashLinkClick={handleHashLinkClick}
          closeMenu={closeMenu}
          isMobile={true}
        />
      </>
    );
  }

  return (
    <>
      {navLinks.map((link) => (
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
        <GetStartedButton handleHashLinkClick={handleHashLinkClick} />
      </NavigationMenuItem>
    </>
  );
};

export default NavLinks;
