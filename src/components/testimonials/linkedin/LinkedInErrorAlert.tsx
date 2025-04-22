
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Linkedin, RefreshCw } from "lucide-react";

interface LinkedInErrorAlertProps {
  errorMessage: string;
  loading: boolean;
  onRetry: () => void;
}

export const LinkedInErrorAlert: React.FC<LinkedInErrorAlertProps> = ({
  errorMessage,
  loading,
  onRetry
}) => {
  return (
    <div className="mt-8 w-full max-w-lg mx-auto">
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <AlertTitle className="flex items-center gap-2">
          <Linkedin className="h-4 w-4" />
          LinkedIn Recommendations Issue
        </AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span>{errorMessage}</span>
          <button 
            onClick={onRetry}
            className="inline-flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700" 
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
};
