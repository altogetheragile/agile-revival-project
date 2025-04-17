
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { getGoogleAuthUrl, handleGoogleRedirect, isGoogleAuthenticated } from "@/integrations/google/drive";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";

interface GoogleAuthButtonProps {
  onAuthStateChange?: (authenticated: boolean) => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ onAuthStateChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if we're coming back from Google auth redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");
    
    // Log any errors from the redirect
    if (error) {
      console.error("Google auth redirect error:", error);
      setErrorMessage(`Google returned error: ${error}`);
      return;
    }
    
    if (code && state) {
      console.log(`Detected auth code: ${code.substring(0, 5)}... and state: ${state}`);
      setIsAuthenticating(true);
      handleGoogleRedirect()
        .then(() => {
          setIsAuthenticated(true);
          setErrorMessage(null);
          onAuthStateChange?.(true);
          toast({
            title: "Google Drive connected",
            description: "Successfully authenticated with Google Drive"
          });
        })
        .catch(error => {
          console.error("Google auth error:", error);
          setErrorMessage(error.message || "Authentication failed");
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
      const authStatus = isGoogleAuthenticated();
      console.log("Current authentication status:", authStatus);
      setIsAuthenticated(authStatus);
      onAuthStateChange?.(authStatus);
    }
  }, [toast, onAuthStateChange]);

  const handleAuth = async (e: React.MouseEvent) => {
    // Prevent form submission when button is clicked
    e.preventDefault();
    
    if (isAuthenticated) {
      // Sign out
      localStorage.removeItem("googleAccessToken");
      localStorage.removeItem("googleRefreshToken");
      localStorage.removeItem("googleTokenExpiry");
      setIsAuthenticated(false);
      setErrorMessage(null);
      onAuthStateChange?.(false);
      toast({
        title: "Signed out",
        description: "Disconnected from Google Drive"
      });
    } else {
      // Sign in
      try {
        setIsAuthenticating(true);
        setErrorMessage(null);
        
        console.log("Current window location:", window.location.href);
        console.log("Redirect will be set to:", window.location.origin + "/admin");
        
        const authUrl = await getGoogleAuthUrl();
        console.log("Generated auth URL:", authUrl);
        
        // Navigate to Google auth page
        window.location.href = authUrl;
      } catch (error) {
        console.error("Google auth error:", error);
        setErrorMessage(error.message || "Authentication error");
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
    <div className="space-y-2">
      <Button
        onClick={handleAuth}
        disabled={isAuthenticating}
        variant={isAuthenticated ? "outline" : "default"}
        type="button" // Explicitly set type to button to prevent form submission
      >
        {isAuthenticating 
          ? "Connecting..."
          : isAuthenticated 
            ? "Disconnect Google Drive" 
            : "Connect Google Drive"
        }
      </Button>
      {errorMessage && (
        <div className="text-red-500 text-sm flex items-center gap-1 mt-2">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      )}
      <div className="text-xs text-gray-400 mt-1">
        Current URL: {window.location.href}
      </div>
    </div>
  );
};
