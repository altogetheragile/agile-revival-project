
import { Link, useLocation } from 'react-router-dom';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

interface NavLinkProps {
  name: string;
  href: string;
  isHash?: boolean;
  handleHashLinkClick: (elementId: string) => void;
  handleFullPageLinkClick: () => void;
  closeMenu?: () => void;
  isMobile?: boolean;
}

export const NavLink = ({ 
  name, 
  href, 
  isHash, 
  handleHashLinkClick, 
  handleFullPageLinkClick,
  closeMenu,
  isMobile
}: NavLinkProps) => {
  const location = useLocation();

  if (isHash && location.pathname === '/') {
    return (
      <button
        onClick={() => {
          handleHashLinkClick(href.split('#')[1]);
          closeMenu?.();
        }}
        className={isMobile
          ? "text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors text-left"
          : navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple"}
      >
        {name}
      </button>
    );
  }

  return (
    <Link
      to={href}
      onClick={() => {
        if (!isHash) handleFullPageLinkClick();
        closeMenu?.();
      }}
      className={isMobile
        ? "text-gray-700 hover:text-agile-purple font-medium py-2 transition-colors"
        : navigationMenuTriggerStyle() + " bg-transparent hover:bg-accent/50 text-gray-700 hover:text-agile-purple"}
    >
      {name}
    </Link>
  );
};
