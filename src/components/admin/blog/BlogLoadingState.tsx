
import React from 'react';

export const BlogLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-500">Loading blog posts...</p>
      </div>
    </div>
  );
};
