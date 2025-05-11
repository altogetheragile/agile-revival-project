
import { AlertCircle, RefreshCw, WifiOff, Database } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { checkDatabaseHealth } from "@/utils/supabase/connection";

interface EventErrorAlertProps {
  error: string;
  onRetry: () => void;
}

export const EventErrorAlert: React.FC<EventErrorAlertProps> = ({ error, onRetry }) => {
  // Function to check database connection and then retry
  const handleConnectionCheck = async () => {
    await checkDatabaseHealth();
    onRetry();
  };

  // Determine if this is likely a connection issue
  const isConnectionIssue = error.toLowerCase().includes('connection') ||
                           error.toLowerCase().includes('network') ||
                           error.toLowerCase().includes('fetch') ||
                           error.toLowerCase().includes('timeout');
  
  // Determine if this is likely a permission issue
  const isPermissionIssue = error.toLowerCase().includes('permission') ||
                           error.toLowerCase().includes('policy') ||
                           error.toLowerCase().includes('recursion') ||
                           error.toLowerCase().includes('security');

  return (
    <Alert 
      variant="destructive" 
      className={`mb-6 ${isConnectionIssue ? 'bg-amber-50 border-amber-300' : ''}`}
    >
      {isConnectionIssue ? (
        <WifiOff className="h-4 w-4" />
      ) : isPermissionIssue ? (
        <Database className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      
      <AlertTitle>
        {isConnectionIssue 
          ? "Connection Issue" 
          : isPermissionIssue 
            ? "Database Permission Issue"
            : "Error Loading Events"}
      </AlertTitle>
      
      <AlertDescription className="flex flex-col gap-2">
        <p>{error}</p>
        
        {isConnectionIssue && (
          <p className="text-sm text-amber-700">
            Please check your internet connection and ensure the database is accessible.
          </p>
        )}
        
        {isPermissionIssue && (
          <p className="text-sm">
            This may be due to a database permission configuration issue. Try enabling Dev Mode temporarily.
          </p>
        )}
        
        <div className="flex gap-2 mt-2">
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="w-fit"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Button>
          
          {isConnectionIssue && (
            <Button 
              onClick={handleConnectionCheck} 
              variant="secondary" 
              className="w-fit"
              size="sm"
            >
              <Database className="h-4 w-4 mr-2" /> Check Connection
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
