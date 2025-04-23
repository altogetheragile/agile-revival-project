
import React from 'react';
import { GlobalResetProvider } from './context/MediaResetContext';

const StorageInitializer: React.FC = () => {
  return (
    <GlobalResetProvider />
  );
};

export default StorageInitializer;
