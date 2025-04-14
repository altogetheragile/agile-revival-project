
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import BlogPostCard from "@/components/blog/BlogPostCard";
import { BlogPost } from "@/types/blog";
import { getAllBlogPosts } from "@/services/blogService";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Load blog posts
  useEffect(() => {
    const loadedPosts = getAllBlogPosts();
    setPosts(loadedPosts);
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-16 bg-accent">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center">Blog</h1>
          <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-8">
            Insights, tips, and stories about agile methodology, product management, and team leadership
          </p>
        </div>
      </div>

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

      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Blog;
