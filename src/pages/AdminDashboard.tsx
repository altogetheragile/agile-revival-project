
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import CourseManagement from "@/components/admin/CourseManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import UserManagement from "@/components/admin/UserManagement";
import SiteSettings from "@/components/admin/SiteSettings";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState<string>("courses");
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, refreshAdminStatus, isAuthReady, user } = useAuth();
  
  // Add an effect to refresh admin status when the component mounts
  useEffect(() => {
    const checkAdmin = async () => {
      console.log("AdminDashboard - Initial auth state:", { 
        userEmail: user?.email, 
        isAdmin,
        userId: user?.id,  
        isAuthReady 
      });
      
      if (isAuthReady) {
        console.log("AdminDashboard - Refreshing admin status");
        setIsChecking(true);
        const isUserAdmin = await refreshAdminStatus(); // Store the boolean result
        console.log("AdminDashboard - Admin status after refresh:", isUserAdmin);
        
        if (!isUserAdmin) {
          toast({
            title: "Access denied",
            description: "You don't have permission to access this page.",
            variant: "destructive"
          });
          navigate("/");
        }
        
        setIsChecking(false);
      }
    };
    
    checkAdmin();
  }, [refreshAdminStatus, isAuthReady, isAdmin, navigate, toast, user]);
  
  // Show loading while checking admin status
  if (isChecking || !isAuthReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-agile-purple" />
        <span className="ml-2 text-lg">Verifying admin access...</span>
      </div>
    );
  }
  
  // This check serves as a backup to ProtectedRoute
  if (isAuthReady && !isAdmin) {
    toast({
      title: "Access denied",
      description: "You don't have permission to access this page.",
      variant: "destructive"
    });
    navigate("/");
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-agile-purple-dark mb-6">Admin Dashboard</h1>
            
            <Tabs defaultValue="courses" value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="mb-8 w-full grid grid-cols-2 md:flex md:w-auto">
                <TabsTrigger value="courses">Course Management</TabsTrigger>
                <TabsTrigger value="blog">Blog Management</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="settings">Site Settings</TabsTrigger>
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
              
              <TabsContent value="settings" className="pt-4">
                <SiteSettings />
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
