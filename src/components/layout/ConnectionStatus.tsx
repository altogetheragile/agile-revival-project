
import { Badge } from "@/components/ui/badge";
import { useConnection } from "@/contexts/ConnectionContext";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ConnectionStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ConnectionStatus = ({ className, showDetails = false }: ConnectionStatusProps) => {
  const { connectionState, checkConnection } = useConnection();
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Handle retry with debounce
  const handleRetry = () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    checkConnection().finally(() => {
      setTimeout(() => setIsRetrying(false), 500);
    });
  };
  
  // Checking state - neutral gray with spinner
  if (connectionState.isChecking) {
    return (
      <div 
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs",
          "bg-gray-100 text-gray-600 border border-gray-200",
          className
        )}
        aria-live="polite"
      >
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Checking</span>
      </div>
    );
  }
  
  // Connected or disconnected states
  return (
    <div aria-live="polite">
      <Badge 
        variant="outline" 
        className={cn(
          connectionState.isConnected 
            ? "bg-green-100 text-green-700 border-green-200" 
            : "bg-red-100 text-red-700 border-red-200",
          "flex items-center",
          className
        )}
      >
        {connectionState.isConnected ? (
          <>
            <CheckCircle className="h-3 w-3 mr-1" />
            <span>Connected</span>
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3 mr-1" />
            <span>Disconnected</span>
          </>
        )}
        
        {showDetails && connectionState.lastChecked && (
          <span className="ml-1 text-xs opacity-70">
            ({new Date(connectionState.lastChecked).toLocaleTimeString()})
          </span>
        )}
        
        {!connectionState.isConnected && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-1 h-5 px-1 text-xs hover:bg-red-200"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? <Loader2 className="h-3 w-3 animate-spin" /> : "Retry"}
          </Button>
        )}
      </Badge>
    </div>
  );
};
