
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { BlogPost } from "@/types/blog";
import { getAllBlogPosts } from "@/services/blogService";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogPosts from "@/components/blog/BlogPosts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching blog posts...");
        const loadedPosts = await getAllBlogPosts();
        console.log("Fetched blog posts:", loadedPosts);
        setPosts(loadedPosts);
      } catch (error) {
        console.error("Error loading blog posts:", error);
        setError("Failed to load blog posts. Please try again later.");
        toast.error("Error loading blog posts");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />
      <BlogHeader />
      
      {loading ? (
        <div className="container mx-auto my-12 px-4 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden shadow">
              <Skeleton className="h-40 w-full" />
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="container mx-auto my-12 px-4 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      ) : (
        <BlogPosts posts={posts} />
      )}
      
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Blog;
