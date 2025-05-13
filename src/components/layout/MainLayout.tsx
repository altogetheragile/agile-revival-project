
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ConnectionStatus } from '@/components/layout/ConnectionStatus';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  // Only show connection status in admin routes
  const showConnectionStatus = location.pathname.startsWith('/admin');
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {showConnectionStatus && (
        <div className="fixed bottom-4 right-4 z-50 w-auto">
          <ConnectionStatus />
        </div>
      )}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
