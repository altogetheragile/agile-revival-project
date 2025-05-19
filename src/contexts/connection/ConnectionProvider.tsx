
import React, { createContext, useContext } from 'react';
import { ConnectionContextType, ConnectionState } from './types';
import { useConnectionState } from './useConnectionState';

const initialState: ConnectionState = {
  isConnected: false,
  isChecking: true,
  lastChecked: null,
  responseTime: null,
  reconnecting: false,
  connectionError: null,
  consecutiveErrors: 0,
};

const ConnectionContext = createContext<ConnectionContextType>({
  connectionState: initialState,
  checkConnection: async () => false,
  resetConnection: async () => {},
});

export const useConnection = () => useContext(ConnectionContext);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, checkConnection, resetConnection } = useConnectionState();
  
  return (
    <ConnectionContext.Provider value={{ 
      connectionState: state, 
      checkConnection, 
      resetConnection 
    }}>
      {children}
    </ConnectionContext.Provider>
  );
};
