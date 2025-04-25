
import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Your header/navbar would typically go here */}
      <main className="flex-grow">
        {children}
      </main>
      {/* Your footer would typically go here */}
    </div>
  );
};

export default MainLayout;
