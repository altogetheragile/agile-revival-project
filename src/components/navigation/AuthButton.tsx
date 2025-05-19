
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface AuthButtonProps {
  isMobile?: boolean;
  closeMenu?: () => void;
}

export function AuthButton({ isMobile, closeMenu }: AuthButtonProps) {
  const { user, isLoading, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      if (closeMenu) closeMenu();
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };
  
  const handleSignIn = () => {
    if (closeMenu) closeMenu();
    navigate('/auth');
  };
  
  if (isLoading) {
    return (
      <Button variant="ghost" disabled className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </Button>
    );
  }
  
  if (user) {
    return (
      <Button 
        variant={isMobile ? "default" : "outline"} 
        onClick={handleSignOut}
        disabled={isSigningOut}
        className={isMobile ? "w-full justify-start" : ""}
      >
        {isSigningOut ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Signing out...
          </>
        ) : (
          "Sign Out"
        )}
      </Button>
    );
  }
  
  return (
    <Button
      variant={isMobile ? "default" : "outline"}
      onClick={handleSignIn}
      className={isMobile ? "w-full justify-start" : ""}
    >
      Sign In
    </Button>
  );
}
