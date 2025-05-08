
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const CourseLoadingState = () => {
  const [loadingTime, setLoadingTime] = useState(0);
  const [timeoutMessage, setTimeoutMessage] = useState("");
  const [showErrorHelp, setShowErrorHelp] = useState(false);
  
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
    } else if (loadingTime === 20) {
      setTimeoutMessage("We're experiencing some difficulties. You may want to try again later.");
      setShowErrorHelp(true);
    }
  }, [loadingTime]);
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
      <span className="text-gray-500">Loading course templates... {loadingTime}s</span>
      
      {timeoutMessage && (
        <div className="mt-4 text-center max-w-md">
          <p className="text-sm text-amber-600">
            {timeoutMessage}
          </p>
          
          {loadingTime > 15 && (
            <Button 
              onClick={handleRefresh}
              className="mt-3"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh page
            </Button>
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
              <li>Supabase connection is not configured correctly</li>
              <li>Database may be offline or unreachable</li>
              <li>There might be permissions issues with the database</li>
              <li>Network connection issues</li>
            </ul>
            <div className="mt-3">
              <Button 
                onClick={handleRefresh}
                size="sm"
                variant="default"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Try again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
