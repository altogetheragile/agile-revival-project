
import React from 'react';
import { GlobalResetProvider } from './MediaLibrary';

const StorageInitializer: React.FC = () => {
  return (
    <>
      <GlobalResetProvider />
    </>
  );
};

export default StorageInitializer;
