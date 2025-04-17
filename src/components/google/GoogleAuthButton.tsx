
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { getGoogleAuthUrl, handleGoogleRedirect, isGoogleAuthenticated } from "@/integrations/google/drive";
import { useToast } from "@/components/ui/use-toast";

interface GoogleAuthButtonProps {
  onAuthStateChange?: (authenticated: boolean) => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ onAuthStateChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { toast } = useToast();

  // Check if we're coming back from Google auth redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    
    if (code && state) {
      setIsAuthenticating(true);
      handleGoogleRedirect()
        .then(() => {
          setIsAuthenticated(true);
          onAuthStateChange?.(true);
          toast({
            title: "Google Drive connected",
            description: "Successfully authenticated with Google Drive"
          });
        })
        .catch(error => {
          console.error("Google auth error:", error);
          toast({
            title: "Authentication failed",
            description: error.message || "Failed to connect to Google Drive",
            variant: "destructive"
          });
        })
        .finally(() => {
          setIsAuthenticating(false);
        });
    } else {
      // Check if we're already authenticated
      setIsAuthenticated(isGoogleAuthenticated());
      onAuthStateChange?.(isGoogleAuthenticated());
    }
  }, [toast, onAuthStateChange]);

  const handleAuth = async () => {
    if (isAuthenticated) {
      // Sign out
      localStorage.removeItem("googleAccessToken");
      localStorage.removeItem("googleRefreshToken");
      localStorage.removeItem("googleTokenExpiry");
      setIsAuthenticated(false);
      onAuthStateChange?.(false);
      toast({
        title: "Signed out",
        description: "Disconnected from Google Drive"
      });
    } else {
      // Sign in
      try {
        setIsAuthenticating(true);
        const authUrl = await getGoogleAuthUrl();
        window.location.href = authUrl;
      } catch (error) {
        console.error("Google auth error:", error);
        toast({
          title: "Authentication error",
          description: error.message || "Could not start Google authentication",
          variant: "destructive"
        });
        setIsAuthenticating(false);
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={isAuthenticating}
      variant={isAuthenticated ? "outline" : "default"}
    >
      {isAuthenticating 
        ? "Connecting..."
        : isAuthenticated 
          ? "Disconnect Google Drive" 
          : "Connect Google Drive"
      }
    </Button>
  );
};
