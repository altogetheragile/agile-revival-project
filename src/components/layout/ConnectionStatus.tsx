
import React, { useEffect, useState } from 'react';
import { useConnection } from '@/contexts/ConnectionContext';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ConnectionStatus: React.FC<{
  className?: string;
  showDetails?: boolean;
}> = ({ className, showDetails = false }) => {
  const { connectionState, checkConnection } = useConnection();
  const { isConnected, isChecking, responseTime, connectionError } = connectionState;
  
  const [isVisible, setIsVisible] = useState(false);
  
  // Only show when there are connection issues
  useEffect(() => {
    if (!isConnected && !isChecking) {
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
  }, [isConnected, isChecking, isVisible]);
  
  if (!isVisible && isConnected) {
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
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-green-500" />
          <span>Connected{responseTime ? ` (${responseTime}ms)` : ''}</span>
        </div>
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
        {isChecking ? 'Checking...' : 'Check'}
      </Button>
    </div>
  );
};
