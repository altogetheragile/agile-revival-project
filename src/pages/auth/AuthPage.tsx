
import AuthForms from "@/components/auth/AuthForms";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/utils/supabase/auth-cleanup";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Check if user is already authenticated and redirect if so
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          navigate('/');
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Clean up auth state if we hit an error
        cleanupAuthState();
      }
    };

    checkAuth();
  }, [navigate]);

  // Add a reactive effect that redirects when session changes
  useEffect(() => {
    if (session) {
      console.log("Session detected, redirecting to home");
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <MainLayout>
      <div className="flex items-center justify-center py-16 px-4">
        <AuthForms />
      </div>
    </MainLayout>
  );
}
