
import AuthContainer from "@/components/auth/AuthContainer";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/utils/supabase/auth-cleanup";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

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

  return <AuthContainer />;
}
