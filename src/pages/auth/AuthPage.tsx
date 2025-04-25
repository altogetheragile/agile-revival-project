
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ResetPasswordForm from "@/components/auth/reset-password/ResetPasswordForm";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('login');
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Sign in to access protected areas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'signup' | 'reset')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
              <TabsTrigger value="reset">Reset</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="pt-4">
              <LoginForm onSuccess={() => navigate(from)} />
            </TabsContent>
            <TabsContent value="signup" className="pt-4">
              <SignupForm onSuccess={() => setAuthMode('login')} />
            </TabsContent>
            <TabsContent value="reset" className="pt-4">
              <ResetPasswordForm onSuccess={() => setAuthMode('login')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
