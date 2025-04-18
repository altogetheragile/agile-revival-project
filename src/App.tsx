
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const ResetPasswordPage = () => {
  useEffect(() => {
    // Handle the password reset
    const handlePasswordReset = async () => {
      const { error } = await supabase.auth.refreshSession();
      // After handling the reset, we could redirect to a change password form or display a message
    };
    
    handlePasswordReset();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Reset Your Password</h1>
        <p className="text-center">
          Please check your email for further instructions on how to reset your password.
        </p>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/training-schedule" element={<TrainingSchedule />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
