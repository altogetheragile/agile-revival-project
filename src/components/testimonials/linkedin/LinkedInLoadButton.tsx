
import React from "react";
import { Linkedin } from "lucide-react";

interface LinkedInLoadButtonProps {
  loading: boolean;
  onLoad: () => void;
}

export const LinkedInLoadButton: React.FC<LinkedInLoadButtonProps> = ({
  loading,
  onLoad
}) => {
  return (
    <div className="mt-8 flex justify-center gap-2 items-center">
      <button 
        onClick={onLoad}
        className="inline-flex items-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded" 
        disabled={loading}
      >
        <Linkedin className="h-4 w-4 mr-2" />
        Load LinkedIn Recommendations
      </button>
    </div>
  );
};
