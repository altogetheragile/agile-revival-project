
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useDevMode } from '@/contexts/DevModeContext';
import { useConnection } from '@/contexts/connection';
import { DevModeToggleHeader } from './DevModeToggleHeader';
import { DatabaseConnectionStatus } from './DatabaseConnectionStatus';
import { DevModeWarning } from './DevModeWarning';
import { MinimizedDevModeToggle } from './MinimizedDevModeToggle';

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
  
  const handleMinimize = () => {
    setMinimized(!minimized);
    // If showing after being minimized, and Dev Mode is on, show expanded
    if (minimized && devMode) {
      setExpanded(true);
    }
  };

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

  const handleDisableDevMode = () => {
    toggleDevMode();
    toast.info("Dev Mode disabled", {
      description: "Security checks have been restored."
    });
  };

  if (minimized) {
    return <MinimizedDevModeToggle devMode={devMode} onMaximize={handleMinimize} />;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`bg-white border rounded-lg shadow-lg p-4 w-72 transition-all duration-200 ${
        devMode ? 'border-red-500 shadow-red-100' : ''
      }`}>
        <DevModeToggleHeader 
          devMode={devMode} 
          onToggle={handleToggle} 
          onMinimize={handleMinimize}
        />
        
        <DatabaseConnectionStatus 
          connectionState={connectionState} 
          onCheckConnection={handleCheckConnection} 
        />
        
        <DevModeWarning 
          expanded={expanded}
          devMode={devMode}
          onToggleExpand={() => setExpanded(!expanded)}
          onDisable={handleDisableDevMode}
        />
      </div>
    </div>
  );
};

export default DevModeToggle;
