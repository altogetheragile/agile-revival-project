
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm, SignupForm, ResetPasswordForm } from "./AuthForms";
import { Link } from "react-router-dom";

interface AuthTabsProps {
  defaultTab?: string;
}

export default function AuthTabs({ defaultTab = "login" }: AuthTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Get the tab parameter from URL if it exists
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    
    // Set the active tab based on URL parameter if it exists
    if (tabParam && ['login', 'signup', 'reset'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Account Access</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="reset">Reset</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm setActiveTab={setActiveTab} />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>

        <TabsContent value="reset">
          <ResetPasswordForm />
        </TabsContent>
      </Tabs>
      <div className="mt-6 text-center text-sm text-gray-600">
        <Link to="/" className="text-agile-purple hover:text-agile-purple-dark">
          Continue as guest
        </Link>
      </div>
    </div>
  );
}
