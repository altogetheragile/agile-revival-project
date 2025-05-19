
import { Database, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectionState {
  isConnected: boolean;
}

interface DatabaseConnectionStatusProps {
  connectionState: ConnectionState;
  onCheckConnection: () => void;
}

export const DatabaseConnectionStatus = ({
  connectionState,
  onCheckConnection
}: DatabaseConnectionStatusProps) => {
  return (
    <div className="flex items-center gap-2 mb-2 text-xs">
      {connectionState.isConnected ? (
        <div className="flex items-center text-green-700">
          <Database size={14} className="mr-1" />
          Database connected
        </div>
      ) : (
        <div className="flex items-center text-red-700">
          <Database size={14} className="mr-1 opacity-50" />
          <XIcon size={12} className="absolute text-red-700" />
          Database disconnected
        </div>
      )}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 text-xs ml-auto" 
        onClick={onCheckConnection}
      >
        Check
      </Button>
    </div>
  );
};
