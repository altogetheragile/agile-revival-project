
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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const queryClient = new QueryClient();

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we're in the password reset flow by looking for hash parameters
    const handlePasswordReset = async () => {
      try {
        const { error } = await supabase.auth.refreshSession();
        if (error) {
          console.error('Error refreshing session:', error);
          toast({
            title: "Error",
            description: "There was an issue processing your password reset request. Please try again.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error('Error handling password reset:', err);
      }
    };
    
    handlePasswordReset();
  }, [toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setSuccess(true);
      toast({
        title: "Success",
        description: "Your password has been updated successfully.",
      });
    } catch (err: any) {
      console.error('Error updating password:', err);
      setError(err.message || "Failed to update password");
      toast({
        title: "Error",
        description: err.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Password Updated!</h1>
          <p className="text-center mb-6">
            Your password has been reset successfully.
          </p>
          <Button 
            className="w-full" 
            onClick={() => window.location.href = '/auth'}
          >
            Continue to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Your Password</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </Button>
        </form>
      </Card>
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
