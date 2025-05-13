
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface BlogErrorStateProps {
  errorMessage: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const BlogErrorState: React.FC<BlogErrorStateProps> = ({ 
  errorMessage, 
  onRefresh, 
  isRefreshing 
}) => {
  return (
    <div className="p-6 border border-red-200 bg-red-50 rounded-lg">
      <div className="flex items-center mb-4">
        <AlertTriangle className="text-red-500 mr-2" />
        <h3 className="text-lg font-semibold text-red-700">Error Loading Blog Posts</h3>
      </div>
      <p className="text-red-600 mb-4">{errorMessage || 'Failed to load blog posts. Please try again.'}</p>
      <Button 
        onClick={onRefresh} 
        variant="outline" 
        className="flex items-center gap-2"
        disabled={isRefreshing}
      >
        <RefreshCw className={`${isRefreshing ? 'animate-spin' : ''} h-4 w-4`} />
        {isRefreshing ? 'Refreshing...' : 'Try Again'}
      </Button>
    </div>
  );
};
