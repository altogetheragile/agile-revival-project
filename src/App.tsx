
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/training-schedule" element={<TrainingSchedule />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/blog" element={<Blog />} />
            
            {/* Protected Admin Route */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Service Pages */}
            <Route path="/services/leadership-coaching" element={<LeadershipCoaching />} />
            <Route path="/services/team-coaching" element={<TeamCoaching />} />
            <Route path="/services/agile-facilitation" element={<AgileFacilitation />} />
            <Route path="/services/performance-metrics" element={<PerformanceMetrics />} />
            <Route path="/services/custom-coaching" element={<CustomCoaching />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
