
import { Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';
import Blog from '@/pages/Blog';
import GoogleAuthCallback from '@/pages/GoogleAuthCallback';
import AuthPage from '@/pages/auth/AuthPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import TrainingSchedule from '@/pages/TrainingSchedule';
import CourseDetails from '@/pages/CourseDetails';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import { SiteSettingsProvider } from '@/contexts/site-settings';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import DevModeToggle from '@/components/dev/DevModeToggle';
import { DevModeProvider } from '@/contexts/DevModeContext';
import { Toaster as SonnerToaster } from 'sonner';
import AgileFacilitation from './pages/services/AgileFacilitation';
import CustomCoaching from './pages/services/CustomCoaching';
import LeadershipCoaching from './pages/services/LeadershipCoaching';
import PerformanceMetrics from './pages/services/PerformanceMetrics';
import TeamCoaching from './pages/services/TeamCoaching';
import { ConnectionProvider } from '@/contexts/connection';

import './App.css';
import ErrorBoundary from './components/layout/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <DevModeProvider>
        <ConnectionProvider>
          <SiteSettingsProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
                <Route path="/training-schedule" element={<TrainingSchedule />} />
                <Route path="/course/:id" element={<CourseDetails />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/services/agile-facilitation" element={<AgileFacilitation />} />
                <Route path="/services/custom-coaching" element={<CustomCoaching />} />
                <Route path="/services/leadership-coaching" element={<LeadershipCoaching />} />
                <Route path="/services/performance-metrics" element={<PerformanceMetrics />} />
                <Route path="/services/team-coaching" element={<TeamCoaching />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <DevModeToggle />
              <Toaster />
              <SonnerToaster 
                position="top-right"
                closeButton={true}
                richColors={true} 
              />
            </AuthProvider>
          </SiteSettingsProvider>
        </ConnectionProvider>
      </DevModeProvider>
    </ErrorBoundary>
  );
}

export default App;
