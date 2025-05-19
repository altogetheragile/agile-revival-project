import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/auth';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const from = (location.state as { from?: string })?.from || "/";

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4 inline-block">
              <ShieldAlert size={48} className="text-red-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. This area requires 
            additional privileges that are not associated with your account.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={goBack} className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Go Back
            </Button>
            <Button onClick={goHome} className="bg-agile-purple hover:bg-agile-purple-dark flex items-center gap-2">
              <Home size={18} />
              Return Home
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UnauthorizedPage;
