
import { 
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import NavLinks from './NavLinks';

type DesktopNavProps = {
  handleHashLinkClick: (elementId: string) => void;
  handleFullPageLinkClick: () => void;
  isAdmin?: boolean;
};

const DesktopNav = ({
  handleHashLinkClick,
  handleFullPageLinkClick,
  isAdmin = true,
}: DesktopNavProps) => {
  return (
    <div className="hidden md:block">
      <NavigationMenu>
        <NavigationMenuList>
          <NavLinks 
            handleHashLinkClick={handleHashLinkClick}
            handleFullPageLinkClick={handleFullPageLinkClick}
            isAdmin={isAdmin}
          />
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DesktopNav;
