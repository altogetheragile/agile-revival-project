
import { useLocation, Link } from 'react-router-dom';

interface GetStartedButtonProps {
  handleHashLinkClick: (elementId: string) => void;
  closeMenu?: () => void;
  isMobile?: boolean;
}

export const GetStartedButton = ({
  handleHashLinkClick,
  closeMenu,
  isMobile
}: GetStartedButtonProps) => {
  const location = useLocation();

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
