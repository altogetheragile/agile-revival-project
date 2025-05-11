
import { AlertCircle, Loader2, RefreshCw, DatabaseZap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { testDatabaseConnection } from "@/utils/databaseHealth";
import { toast } from "sonner";
import { useDevMode } from "@/contexts/DevModeContext";

export const EventLoadingState = () => {
  const [loadingTime, setLoadingTime] = useState(0);
  const [timeoutMessage, setTimeoutMessage] = useState("");
  const [showErrorHelp, setShowErrorHelp] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const { devMode, toggleDevMode } = useDevMode();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (loadingTime === 5) {
      setTimeoutMessage("This is taking a bit longer than usual.");
    } else if (loadingTime === 10) {
      setTimeoutMessage("Taking longer than expected. There might be a connection issue.");
      // At 10 seconds, check database connection
      checkDatabaseConnection();
    } else if (loadingTime === 20) {
      setTimeoutMessage("We're experiencing some difficulties. You may want to try again later or enable Dev Mode.");
      setShowErrorHelp(true);
    }
  }, [loadingTime]);
  
  const checkDatabaseConnection = async () => {
    if (isCheckingConnection) return;
    
    setIsCheckingConnection(true);
    try {
      const status = await testDatabaseConnection();
      
      if (!status.isConnected) {
        console.error("Database connection test failed:", status.error);
        toast.error("Database connection issue", {
          description: "Could not connect to the database. You may want to try enabling Dev Mode."
        });
        setShowErrorHelp(true);
      } else {
        console.log(`Database connection test successful. Response time: ${status.responseTime}ms`);
        // If response time is very slow, show a warning
        if (status.responseTime > 5000) {
          toast.warning("Slow database connection", {
            description: "The database is responding slowly, which may affect performance."
          });
        }
      }
    } catch (err) {
      console.error("Error checking database connection:", err);
      setShowErrorHelp(true);
    } finally {
      setIsCheckingConnection(false);
    }
  };
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  const handleTestConnection = async () => {
    await checkDatabaseConnection();
  };
  
  const handleToggleDevMode = () => {
    toggleDevMode();
    toast.success(devMode ? "Dev Mode disabled" : "Dev Mode enabled", {
      description: devMode 
        ? "Security checks have been restored." 
        : "Security checks are now bypassed for development."
    });
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
      <span className="text-gray-500">Loading events... {loadingTime}s</span>
      
      {timeoutMessage && (
        <div className="mt-4 text-center max-w-md">
          <p className="text-sm text-amber-600">
            {timeoutMessage}
          </p>
          
          {loadingTime > 10 && (
            <div className="flex flex-col sm:flex-row gap-2 mt-3 justify-center">
              <Button 
                onClick={handleRefresh}
                variant="secondary"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Refresh page
              </Button>
              
              <Button
                onClick={handleTestConnection}
                variant="outline"
                size="sm"
                className="border-amber-400"
                disabled={isCheckingConnection}
              >
                <DatabaseZap className="h-4 w-4 mr-1" /> Test connection
              </Button>
              
              <Button
                onClick={handleToggleDevMode}
                variant={devMode ? "destructive" : "default"}
                size="sm"
              >
                {devMode ? "Disable Dev Mode" : "Enable Dev Mode"}
              </Button>
            </div>
          )}
        </div>
      )}
      
      {showErrorHelp && (
        <Alert className="mt-6 max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection issues detected</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Possible causes:</p>
            <ul className="list-disc pl-5 text-sm">
              <li>Database connection is not configured correctly</li>
              <li>Network connection issues</li>
              <li>Permission issues with database access</li>
              <li>Row Level Security (RLS) policies may be too restrictive</li>
              <li>Database function errors or recursion issues</li>
            </ul>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleRefresh}
                size="sm"
                variant="default"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Try again
              </Button>
              
              <Button
                onClick={handleToggleDevMode}
                size="sm"
                variant={devMode ? "destructive" : "default"}
              >
                {devMode ? "Disable Dev Mode" : "Enable Dev Mode"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
