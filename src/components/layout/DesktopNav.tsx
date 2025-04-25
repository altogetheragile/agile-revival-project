
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { AuthButton } from '../navigation/AuthButton';
import { ShieldCheck } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface DesktopNavProps {
  handleHashLinkClick: (id: string) => void;
  handleFullPageLinkClick: () => void;
}

const DesktopNav = ({ handleHashLinkClick, handleFullPageLinkClick }: DesktopNavProps) => {
  const { isAdmin } = useAuth();
  
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink 
              className={navigationMenuTriggerStyle()} 
              onClick={handleFullPageLinkClick}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/training-schedule">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Training
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink 
            className={navigationMenuTriggerStyle()}
            onClick={() => handleHashLinkClick('services')}
          >
            Services
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/blog">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink 
            className={navigationMenuTriggerStyle()}
            onClick={() => handleHashLinkClick('about')}
          >
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink 
            className={navigationMenuTriggerStyle()}
            onClick={() => handleHashLinkClick('contact')}
          >
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        {/* Admin Dashboard Link */}
        {isAdmin && (
          <NavigationMenuItem>
            <Link to="/admin">
              <NavigationMenuLink 
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center gap-1"
                )}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
        
        <NavigationMenuItem>
          <AuthButton />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNav;
