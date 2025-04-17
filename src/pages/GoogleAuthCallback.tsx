
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleGoogleRedirect } from "@/integrations/google/drive";
import { useToast } from "@/components/ui/use-toast";

const GoogleAuthCallback = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const processAuthCode = async () => {
      try {
        console.log("Processing Google auth callback");
        console.log("Current URL:", window.location.href);
        
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const errorParam = urlParams.get("error");
        
        if (errorParam) {
          console.error("Google auth error from URL:", errorParam);
          setError(`Google authentication error: ${errorParam}`);
          toast({
            title: "Authentication failed",
            description: `Google returned an error: ${errorParam}`,
            variant: "destructive"
          });
          setTimeout(() => navigate("/admin"), 3000);
          return;
        }
        
        if (!code || !state) {
          console.error("Missing code or state in callback URL");
          setError("Missing authentication parameters");
          toast({
            title: "Authentication failed",
            description: "Missing required authentication parameters",
            variant: "destructive"
          });
          setTimeout(() => navigate("/admin"), 3000);
          return;
        }
        
        await handleGoogleRedirect();
        toast({
          title: "Google Drive connected",
          description: "Successfully authenticated with Google Drive"
        });
        navigate("/admin");
      } catch (error) {
        console.error("Error processing Google auth callback:", error);
        setError(error.message || "Authentication failed");
        toast({
          title: "Authentication failed",
          description: error.message || "Failed to connect to Google Drive",
          variant: "destructive"
        });
        setTimeout(() => navigate("/admin"), 3000);
      } finally {
        setIsProcessing(false);
      }
    };
    
    processAuthCode();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">
          {isProcessing ? "Processing Google Authentication" : (
            error ? "Authentication Failed" : "Authentication Successful"
          )}
        </h1>
        
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">Please wait while we connect your Google Drive...</p>
          </div>
        ) : (
          <>
            {error ? (
              <div className="text-red-500 mb-4">
                {error}
              </div>
            ) : (
              <div className="text-green-500 mb-4">
                Connected to Google Drive successfully!
              </div>
            )}
            <p className="text-gray-600">
              {error 
                ? "There was a problem connecting to Google Drive. Redirecting you back..." 
                : "You will be redirected back to the admin dashboard..."}
            </p>
          </>
        )}
        
        <div className="mt-6 text-xs text-gray-400 bg-gray-50 p-2 rounded">
          <div>Debug Information:</div>
          <div>Current URL: {window.location.href}</div>
          <div>Redirect Path: /auth/google/callback</div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
