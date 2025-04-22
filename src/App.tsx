
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteSettingsProvider } from "@/contexts/site-settings";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TrainingSchedule from "./pages/TrainingSchedule";
import CourseDetails from "./pages/CourseDetails";
import Blog from "./pages/Blog";
import AdminDashboard from "./pages/AdminDashboard";
import ScrollToTop from "./components/layout/ScrollToTop";
import LeadershipCoaching from "./pages/services/LeadershipCoaching";
import TeamCoaching from "./pages/services/TeamCoaching";
import AgileFacilitation from "./pages/services/AgileFacilitation";
import PerformanceMetrics from "./pages/services/PerformanceMetrics";
import CustomCoaching from "./pages/services/CustomCoaching";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "@/pages/auth/AuthPage";
import StorageInitializer from "@/components/media/StorageInitializer";

// Create a client with sensible default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Simple placeholder for the reset password page
const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <p>Password reset functionality has been removed from this application.</p>
      </div>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SiteSettingsProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <ScrollToTop />
              <StorageInitializer />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/training-schedule" element={<TrainingSchedule />} />
                <Route path="/course/:id" element={<CourseDetails />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                
                {/* Admin route now accessible without protection */}
                <Route path="/admin" element={<AdminDashboard />} />
                
                <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
                
                <Route path="/services/leadership-coaching" element={<LeadershipCoaching />} />
                <Route path="/services/team-coaching" element={<TeamCoaching />} />
                <Route path="/services/agile-facilitation" element={<AgileFacilitation />} />
                <Route path="/services/performance-metrics" element={<PerformanceMetrics />} />
                <Route path="/services/custom-coaching" element={<CustomCoaching />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </SiteSettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
