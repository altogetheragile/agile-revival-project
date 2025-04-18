
import { useState, useEffect, useCallback } from "react";
import { isGoogleAuthenticated } from "@/integrations/google/drive";

export const useDriveAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(isGoogleAuthenticated());
  const [error, setError] = useState(null);
  const [apiEnableUrl, setApiEnableUrl] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const checkAuthStatus = useCallback(() => {
    const authStatus = isGoogleAuthenticated();
    console.log("Authentication check result:", authStatus);
    setIsAuthenticated(authStatus);
    setLastChecked(new Date());
  }, []);

  const checkForApiEnableUrl = useCallback((errorMessage: string) => {
    const match = errorMessage?.match(/https:\/\/console\.developers\.google\.com\/apis\/api\/drive\.googleapis\.com\/overview\?project=[0-9]+/);
    setApiEnableUrl(match ? match[0] : null);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    isAuthenticated,
    error,
    setError,
    apiEnableUrl,
    checkForApiEnableUrl,
    checkAuthStatus,
    lastChecked
  };
};
