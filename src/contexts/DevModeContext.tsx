
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface DevModeContextType {
  devMode: boolean;
  toggleDevMode: () => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [devMode, setDevMode] = useState<boolean>(false);
  
  // Check localStorage for persisted dev mode state on initial load
  useEffect(() => {
    const storedDevMode = localStorage.getItem('devModeEnabled');
    if (storedDevMode === 'true') {
      setDevMode(true);
      console.log("[Dev Mode] Restored from localStorage:", true);
    }
  }, []);

  const toggleDevMode = () => {
    const newDevMode = !devMode;
    // Persist to localStorage
    localStorage.setItem('devModeEnabled', String(newDevMode));
    setDevMode(newDevMode);
    console.log("[Dev Mode] Toggled to:", newDevMode);
    
    // Force refresh database connections when switching to dev mode
    if (newDevMode) {
      // If we have the connection context available, we could call resetConnection() here
      // But we'll just let the system detect the change naturally
    }
  };

  return (
    <DevModeContext.Provider value={{ devMode, toggleDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
}

export const useDevMode = (): DevModeContextType => {
  const context = useContext(DevModeContext);
  if (context === undefined) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
};
