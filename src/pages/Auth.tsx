
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthTabs from "@/components/auth/AuthTabs";

export default function Auth() {
  const { user } = useAuth();

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-md mx-auto px-4">
          <AuthTabs />
        </div>
      </main>
      <Footer />
    </div>
  );
}
