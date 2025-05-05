
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
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import { DevModeProvider } from "@/contexts/DevModeContext";
import DevModeToggle from "@/components/dev/DevModeToggle";

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

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SiteSettingsProvider>
          <DevModeProvider>
            <BrowserRouter>
              <AuthProvider>
                <Toaster />
                <Sonner />
                <ScrollToTop />
                <StorageInitializer />
                <DevModeToggle />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/training-schedule" element={<TrainingSchedule />} />
                  <Route path="/course/:id" element={<CourseDetails />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="/services/leadership-coaching" element={<LeadershipCoaching />} />
                  <Route path="/services/team-coaching" element={<TeamCoaching />} />
                  <Route path="/services/agile-facilitation" element={<AgileFacilitation />} />
                  <Route path="/services/performance-metrics" element={<PerformanceMetrics />} />
                  <Route path="/services/custom-coaching" element={<CustomCoaching />} />
                  
                  {/* Protected admin route */}
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </DevModeProvider>
        </SiteSettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
