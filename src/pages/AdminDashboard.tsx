
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import CourseManagement from "@/components/admin/CourseManagement";
import { BlogManagement } from "@/components/admin/BlogManagement";
import UserManagement from "@/components/admin/UserManagement";
import SiteSettings from "@/components/admin/SiteSettings";
import PageManagement from "@/components/admin/PageManagement";
import AdminMediaManager from "@/components/media/AdminMediaManager";
import { ConnectionStatus } from "@/components/layout/ConnectionStatus";
import AdminBadge from "@/components/user/AdminBadge";
import { useConnection } from "@/contexts/ConnectionContext";
import { Alert } from "@/components/ui/alert";
import RefreshControls from "@/components/training/RefreshControls";
import { useOptimisticCourses } from "@/hooks/useOptimisticCourses";

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState<string>("courses");
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, isAuthReady, user } = useAuth();
  const { connectionState, checkConnection } = useConnection();
  const { 
    isRefreshing, 
    handleManualRefresh, 
    handleForceReset 
  } = useOptimisticCourses();
  
  useEffect(() => {
    setIsChecking(false);
    
    // Check if user is authenticated and admin
    if (isAuthReady && !user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to access the admin dashboard",
        variant: "destructive",
      });
      navigate('/auth', { state: { from: '/admin' } });
    } else if (isAuthReady && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You do not have admin privileges to access this page.",
        variant: "destructive",
      });
      navigate('/unauthorized');
    }
  }, [isAuthReady, isAdmin, user, navigate, toast]);

  // Test connection when first loading the admin dashboard
  useEffect(() => {
    if (isAuthReady) {
      checkConnection();
    }
  }, [isAuthReady, checkConnection]);

  // Log state for debugging purposes
  useEffect(() => {
    console.log("Admin Dashboard State:", { 
      currentTab, 
      isChecking, 
      isAuthReady, 
      isAdmin: isAdmin || false,
      hasUser: !!user,
      connectionStatus: connectionState.isConnected ? 'connected' : 'disconnected'
    });
  }, [currentTab, isChecking, isAuthReady, isAdmin, user, connectionState]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-agile-purple-dark">Admin Dashboard</h1>
              <div className="flex items-center gap-2">
                <AdminBadge />
                <ConnectionStatus className="text-xs" showDetails={true} />
              </div>
            </div>
            
            {!connectionState.isConnected && (
              <Alert className="mb-4 border-amber-300 bg-amber-50">
                <div className="flex flex-col">
                  <p className="font-medium">Connection issue detected</p>
                  <p className="text-sm mt-1">
                    Having trouble connecting to the database. Some features may not work correctly.
                    Try refreshing the page.
                  </p>
                </div>
              </Alert>
            )}
            
            {currentTab === "courses" && (
              <RefreshControls 
                isRefreshing={isRefreshing}
                onManualRefresh={handleManualRefresh}
                onForceReset={handleForceReset}
              />
            )}
            
            <Tabs defaultValue="courses" value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="mb-8 w-full grid grid-cols-2 md:flex md:w-auto">
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="blog">Blog</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="pages">Pages</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>
              
              <TabsContent value="courses" className="pt-4">
                <CourseManagement />
              </TabsContent>
              
              <TabsContent value="blog" className="pt-4">
                <BlogManagement />
              </TabsContent>
              
              <TabsContent value="users" className="pt-4">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="pages" className="pt-4">
                <PageManagement />
              </TabsContent>
              
              <TabsContent value="settings" className="pt-4">
                <SiteSettings />
              </TabsContent>

              <TabsContent value="media" className="pt-4">
                <AdminMediaManager />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AdminDashboard;
