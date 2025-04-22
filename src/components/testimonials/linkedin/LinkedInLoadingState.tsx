
import React from "react";
import { Loader2 } from "lucide-react";

interface LinkedInLoadingStateProps {
  loading: boolean;
}

export const LinkedInLoadingState: React.FC<LinkedInLoadingStateProps> = ({ loading }) => {
  if (!loading) return null;
  
  return (
    <div className="mt-8 flex justify-center items-center gap-2 text-sm text-gray-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Loading LinkedIn recommendations...</span>
    </div>
  );
};
