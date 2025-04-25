
import { X, Menu } from 'lucide-react';
import NavLinks from './NavLinks';

type MobileNavProps = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  handleHashLinkClick: (elementId: string) => void;
  handleFullPageLinkClick: () => void;
};

const MobileNav = ({
  isMenuOpen,
  toggleMenu,
  closeMenu,
  handleHashLinkClick,
  handleFullPageLinkClick,
}: MobileNavProps) => {
  return (
    <>
      {/* Mobile Navigation Toggle */}
      <button 
        className="md:hidden text-gray-700 focus:outline-none" 
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 p-4 flex flex-col space-y-4 animate-fade-in">
          <NavLinks 
            handleHashLinkClick={handleHashLinkClick}
            handleFullPageLinkClick={handleFullPageLinkClick}
            closeMenu={closeMenu}
            isMobile={true}
          />
        </div>
      )}
    </>
  );
};

export default MobileNav;
