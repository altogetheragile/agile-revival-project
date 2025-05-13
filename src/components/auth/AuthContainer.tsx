
import React from 'react';
import AuthDivider from './AuthDivider';
import { LoginView, SignupView, ResetPasswordView } from './views';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cleanupAuthState } from '@/utils/supabase/auth-cleanup';
import { supabase } from '@/integrations/supabase/client';

const AuthContainer = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Clean up auth state when the auth container mounts
  React.useEffect(() => {
    // Clean up any existing auth state to prevent auth limbo
    cleanupAuthState();
    
    // Try to sign out to clear any existing session
    supabase.auth.signOut({ scope: 'global' }).catch(err => {
      console.warn("[Auth] Error during initial signout:", err);
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {activeTab === "login" ? "Login to your account" : 
           activeTab === "signup" ? "Create an account" : "Reset your password"}
        </h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginView onResetClick={() => setActiveTab("reset")} />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupView />
          </TabsContent>
          
          <TabsContent value="reset">
            <ResetPasswordView onBackToLogin={() => setActiveTab("login")} />
          </TabsContent>
        </Tabs>
        
        <AuthDivider />
      </div>
    </div>
  );
};

export default AuthContainer;
