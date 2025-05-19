
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Shield, User as UserIcon } from "lucide-react";
import { useEffect } from "react";

interface UserAvatarProps {
  size?: "sm" | "md" | "lg";
}

const UserAvatar = ({ size = "md" }: UserAvatarProps) => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("[UserAvatar Debug] User state:", { 
      userId: user?.id, 
      email: user?.email, 
      isAdmin 
    });
  }, [user, isAdmin]);

  if (!user) return null;

  // Get initials from user data
  const getInitials = () => {
    const userEmail = user?.email || "";
    if (userEmail) {
      return userEmail.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Size classes for avatar
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base"
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 h-auto rounded-full">
            <Avatar className={sizeClasses[size]}>
              <AvatarFallback className="bg-agile-purple text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.email}</p>
              {isAdmin && (
                <Badge variant="outline" className="bg-agile-purple/10 text-agile-purple border-agile-purple/20 self-start mt-1">
                  Admin
                </Badge>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isAdmin && (
            <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => navigate("/account")} className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>My Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Show admin indicator dot */}
      {isAdmin && (
        <div className="absolute bottom-0 right-0 h-3 w-3 bg-agile-purple rounded-full border-2 border-white"></div>
      )}
    </div>
  );
};

export default UserAvatar;
