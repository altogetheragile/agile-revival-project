
import React, { useEffect, useState } from 'react';
import { useConnection } from '@/contexts/ConnectionContext';
import { Wifi, WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDevMode } from '@/contexts/DevModeContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const ConnectionStatus: React.FC<{
  className?: string;
  showDetails?: boolean;
}> = ({ className, showDetails = false }) => {
  const { connectionState, checkConnection } = useConnection();
  const { isConnected, isChecking, responseTime, connectionError, consecutiveErrors } = connectionState;
  const { devMode } = useDevMode();
  
  const [isVisible, setIsVisible] = useState(false);
  
  // Show when there are connection issues or in dev mode
  useEffect(() => {
    if (!isConnected && !isChecking) {
      setIsVisible(true);
    } else if (devMode) {
      setIsVisible(true); 
    } else {
      // Hide after a short delay when connection is restored
      if (isVisible && isConnected) {
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isConnected, isChecking, isVisible, devMode]);
  
  // Always show when connection issues persist
  if (consecutiveErrors > 2) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              "flex items-center gap-2 text-sm p-2 rounded-md transition-all bg-red-50 text-red-700",
              className
            )}>
              <WifiOff className="h-4 w-4 text-red-500" />
              <span>Connection issues ({consecutiveErrors})</span>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => checkConnection()}
                disabled={isChecking}
              >
                <RefreshCw className={cn("h-3 w-3", isChecking && "animate-spin")} />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-xs">
              Multiple connection errors detected. This might indicate a permission configuration issue.
              Try enabling Dev Mode as a workaround.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  if ((!isVisible && isConnected) || (isConnected && !showDetails && !devMode)) {
    return null;
  }
  
  return (
    <div className={cn(
      "flex items-center gap-2 text-sm p-2 rounded-md transition-all",
      isConnected ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
      className
    )}>
      {isChecking ? (
        <div className="animate-pulse flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Checking connection...</span>
        </div>
      ) : isConnected ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-green-500" />
                <span>Connected{responseTime ? ` (${responseTime}ms)` : ''}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Database connection status: {isConnected ? 'OK' : 'Error'}<br />
                Response time: {responseTime || '?'}ms
                {devMode && <span className="block font-semibold text-amber-600">Dev Mode Active</span>}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4 text-red-500" />
          <span>Disconnected</span>
        </div>
      )}
      
      {showDetails && connectionError && !isConnected && (
        <div className="text-xs mt-1 text-red-500">{connectionError}</div>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className="h-6 text-xs"
        onClick={() => checkConnection()}
        disabled={isChecking}
      >
        {isChecking ? (
          <RefreshCw className="h-3 w-3 animate-spin mr-1" />
        ) : (
          <RefreshCw className="h-3 w-3 mr-1" />
        )}
        {isChecking ? 'Checking...' : 'Check'}
      </Button>
    </div>
  );
};
