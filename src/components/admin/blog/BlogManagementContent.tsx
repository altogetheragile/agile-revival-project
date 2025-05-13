
import React from 'react';
import { BlogPostGrid } from "./BlogPostGrid";

interface BlogManagementContentProps {
  filteredPosts: any[];
  isRefreshing: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const BlogManagementContent: React.FC<BlogManagementContentProps> = ({
  filteredPosts,
  isRefreshing,
  onEdit,
  onDelete
}) => {
  return (
    <div className="relative">
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      <BlogPostGrid 
        posts={filteredPosts} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    </div>
  );
};
