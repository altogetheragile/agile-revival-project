
import { Badge } from "@/components/ui/badge";
import { useConnection } from "@/contexts/ConnectionContext";
import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ConnectionStatus = ({ className, showDetails = false }: ConnectionStatusProps) => {
  const { connectionState } = useConnection();
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        connectionState.isConnected 
          ? "bg-green-100 text-green-700 border-green-200" 
          : "bg-red-100 text-red-700 border-red-200",
        className
      )}
    >
      {connectionState.isConnected ? "Connected" : "Disconnected"}
      {showDetails && connectionState.lastChecked && (
        <span className="ml-1 text-xs opacity-70">
          ({new Date(connectionState.lastChecked).toLocaleTimeString()})
        </span>
      )}
    </Badge>
  );
};
