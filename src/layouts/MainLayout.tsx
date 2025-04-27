
import { Outlet } from 'react-router-dom';
import UserAvatar from '@/components/user/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-agile-purple">
            Agile Training
          </a>
          <div className="flex items-center gap-4">
            {user ? (
              <UserAvatar />
            ) : (
              <a href="/auth" className="text-agile-purple hover:text-agile-purple-dark">
                Sign In
              </a>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © {new Date().getFullYear()} Agile Training. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
