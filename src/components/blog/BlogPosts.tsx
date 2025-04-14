
import React from 'react';
import { BlogPost } from "@/types/blog";
import BlogPostCard from "./BlogPostCard";

interface BlogPostsProps {
  posts: BlogPost[];
}

const BlogPosts = ({ posts }: BlogPostsProps) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">
            No published posts yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogPosts;
