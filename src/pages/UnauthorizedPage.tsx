
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ChevronLeft } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="text-center max-w-lg">
          <Shield className="mx-auto h-16 w-16 text-amber-500 mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            You don't have permission to access this page. If you believe this is
            an error, please contact your administrator.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={16} />
              Go Back
            </Button>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UnauthorizedPage;
