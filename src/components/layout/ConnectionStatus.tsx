import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Attempt to fetch a resource from the same origin
        const response = await fetch('/api/health');
        setIsConnected(response.ok);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection(); // Initial check

    const intervalId = setInterval(checkConnection, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const statusStyle = {
    base: "flex items-center gap-2 rounded-md text-sm font-medium transition-colors",
    connected: "bg-green-500 text-white",
    disconnected: "bg-red-500 text-white",
    loading: "bg-gray-200 text-gray-600 animate-pulse",
    icon: "h-4 w-4"
  };

  let statusText: string;
  let icon;
  let className: string;

  if (isConnected === null) {
    statusText = "Checking connection...";
    icon = <Loader2 className={`${statusStyle.icon} animate-spin`} />;
    className = statusStyle.base + " " + statusStyle.loading;
  } else if (isConnected) {
    statusText = "Connected to database";
    icon = <CheckCircle className={statusStyle.icon} />;
    className = statusStyle.base + " " + statusStyle.connected;
  } else {
    statusText = "Disconnected from database";
    icon = <AlertTriangle className={statusStyle.icon} />;
    className = statusStyle.base + " " + statusStyle.disconnected;
  }

  return (
    <div className={className} style={{ padding: '0.5rem 1rem' }}>
      {icon}
      <span>{statusText}</span>
    </div>
  );
};
