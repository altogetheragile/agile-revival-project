
import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, fullWidth = true }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Your header/navbar would typically go here */}
      <main className={`flex-grow ${fullWidth ? 'w-full' : 'container mx-auto px-4'}`}>
        {children}
      </main>
      {/* Your footer would typically go here */}
    </div>
  );
};

export default MainLayout;
