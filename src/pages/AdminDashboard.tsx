
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import CourseManagement from "@/components/admin/CourseManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import UserManagement from "@/components/admin/UserManagement";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState<string>("courses");
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-agile-purple-dark">Admin Dashboard</h1>
              <div className="text-sm text-gray-600">
                Logged in as: <span className="font-medium">{user?.email}</span>
              </div>
            </div>
            
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
                <div className="bg-white shadow-md rounded-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Site Settings</h2>
                  <p className="text-gray-600">Site settings functionality will be implemented here.</p>
                </div>
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
