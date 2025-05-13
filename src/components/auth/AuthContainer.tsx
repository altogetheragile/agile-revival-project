
import React from 'react';
import AuthDivider from './AuthDivider';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ResetPasswordForm from './ResetPasswordForm';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cleanupAuthState } from '@/utils/supabase/auth-cleanup';
import { supabase } from '@/integrations/supabase/client';

export type AuthMode = 'login' | 'signup' | 'reset';

const AuthContainer = () => {
  const [activeTab, setActiveTab] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Clean up auth state when the auth container mounts
  React.useEffect(() => {
    // Clean up any existing auth state to prevent auth limbo
    cleanupAuthState();
    
    // Try to sign out to clear any existing session
    supabase.auth.signOut({ scope: 'global' }).catch(err => {
      console.warn("[Auth] Error during initial signout:", err);
    });
  }, []);
  
  // Mock auth handlers for demo
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder for actual login logic
      console.log("Login attempted with:", email);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };
  
  const handleSignup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder for actual signup logic
      console.log("Signup attempted with:", email);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    } catch (err) {
      setError("Signup failed. Please try again.");
      setLoading(false);
    }
  };
  
  const handleResetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Placeholder for actual reset logic
      console.log("Password reset requested for:", email);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("Password reset request failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {activeTab === "login" ? "Login to your account" : 
           activeTab === "signup" ? "Create an account" : "Reset your password"}
        </h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab as (value: string) => void}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm 
              onSubmit={handleLogin} 
              onSwitchToSignup={() => setActiveTab("signup")}
              onSwitchToReset={() => setActiveTab("reset")}
              loading={loading}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm 
              onSubmit={handleSignup}
              onSwitchToLogin={() => setActiveTab("login")}
              loading={loading}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="reset">
            <ResetPasswordForm 
              onResetClick={handleResetPassword}
              onSwitchToLogin={() => setActiveTab("login")}
              loading={loading}
              error={error}
              success={success}
            />
          </TabsContent>
        </Tabs>
        
        <AuthDivider />
      </div>
    </div>
  );
};

export default AuthContainer;
