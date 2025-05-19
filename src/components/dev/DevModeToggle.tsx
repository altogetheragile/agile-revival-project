import { useDevMode } from '@/contexts/DevModeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Shield, ShieldOff, ShieldAlert, X, Database, X as XIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useConnection } from '@/contexts/ConnectionContext';

const DevModeToggle = () => {
  const { devMode, toggleDevMode } = useDevMode();
  const [expanded, setExpanded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const { connectionState, checkConnection } = useConnection();
  
  // Show expanded state initially when Dev Mode is active
  useEffect(() => {
    if (devMode) {
      setExpanded(true);
    }
  }, [devMode]);

  const handleToggle = () => {
    const newState = !devMode;
    toggleDevMode();
    
    // Check connection after toggling Dev Mode
    setTimeout(() => {
      checkConnection();
    }, 500);
    
    // Show toast when changing the state
    if (newState) {
      toast.success("Dev Mode enabled", {
        description: "Security checks are now bypassed for development.",
      });
      // Auto-expand when enabling
      setExpanded(true);
      setMinimized(false);
    } else {
      toast.info("Dev Mode disabled", {
        description: "Security checks have been restored.",
      });
    }
  };
  
  // Allow completely hiding the Dev Mode toggle
  const handleMinimize = () => {
    setMinimized(!minimized);
    // If showing after being minimized, and Dev Mode is on, show expanded
    if (minimized && devMode) {
      setExpanded(true);
    }
  };

  // Check connection manually
  const handleCheckConnection = () => {
    toast.loading("Checking connection...", { id: "connection-check" });
    checkConnection()
      .then(isConnected => {
        if (isConnected) {
          toast.success("Database connected", { id: "connection-check" });
        } else {
          toast.error("Database disconnected", { id: "connection-check" });
        }
      })
      .catch(error => {
        toast.error("Connection check failed", { id: "connection-check" });
        console.error("Connection check error:", error);
      });
  };

  if (minimized) {
    return (
      <Button
        onClick={handleMinimize}
        className="fixed bottom-4 left-4 z-50 h-8 w-8 rounded-full p-0"
        variant={devMode ? "destructive" : "secondary"}
        size="icon"
        title="Show Dev Mode toggle"
      >
        {devMode ? <ShieldAlert size={16} /> : <Shield size={16} />}
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`bg-white border rounded-lg shadow-lg p-4 w-72 transition-all duration-200 ${
        devMode ? 'border-red-500 shadow-red-100' : ''
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {devMode ? (
              <ShieldAlert className="text-red-500" size={18} />
            ) : (
              <Shield className="text-green-500" size={18} />
            )}
            <Label htmlFor="dev-mode" className="font-medium">
              Development Mode
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="dev-mode"
              checked={devMode}
              onCheckedChange={handleToggle}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full" 
              onClick={() => setMinimized(true)}
            >
              <X size={14} />
            </Button>
          </div>
        </div>
        
        {/* Show database connection status */}
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
            onClick={handleCheckConnection}
          >
            Check
          </Button>
        </div>
        
        {devMode && (
          <Alert variant="destructive" className="mt-2 py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Security is disabled! All authentication and authorization checks are bypassed.
            </AlertDescription>
          </Alert>
        )}
        
        {!devMode && (
          <p className="text-xs text-gray-500 mt-1">
            Toggle to bypass authentication & authorization checks for development
          </p>
        )}
        
        {devMode && !expanded && (
          <button 
            onClick={() => setExpanded(true)}
            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
          >
            Show more info
          </button>
        )}
        
        {devMode && expanded && (
          <div className="mt-2 text-xs border-t pt-2">
            <p className="font-semibold text-red-600">Dev Mode active!</p>
            <ul className="list-disc pl-4 mt-1 space-y-1 text-gray-700">
              <li>All auth checks are bypassed</li>
              <li>Admin access is granted to all routes</li>
              <li>Database RLS policies are ignored</li>
              <li>This state persists across page refreshes</li>
              <li>Changes are saved locally in browser storage</li>
            </ul>
            <div className="flex justify-between mt-2">
              <button 
                onClick={() => setExpanded(false)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Hide info
              </button>
              <button
                onClick={() => {
                  toggleDevMode();
                  toast.info("Dev Mode disabled", {
                    description: "Security checks have been restored."
                  });
                }}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Disable Dev Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevModeToggle;
