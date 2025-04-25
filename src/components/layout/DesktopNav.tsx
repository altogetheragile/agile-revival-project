
import { 
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import NavLinks from './NavLinks';

type DesktopNavProps = {
  handleHashLinkClick: (elementId: string) => void;
  handleFullPageLinkClick: () => void;
};

const DesktopNav = ({
  handleHashLinkClick,
  handleFullPageLinkClick,
}: DesktopNavProps) => {
  return (
    <div className="hidden md:block">
      <NavigationMenu>
        <NavigationMenuList>
          <NavLinks 
            handleHashLinkClick={handleHashLinkClick}
            handleFullPageLinkClick={handleFullPageLinkClick}
          />
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DesktopNav;
