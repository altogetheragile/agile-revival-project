
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { BlogPost } from "@/types/blog";
import { getAllBlogPosts } from "@/services/blogService";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogPosts from "@/components/blog/BlogPosts";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const loadedPosts = await getAllBlogPosts();
        setPosts(loadedPosts);
      } catch (error) {
        console.error("Error loading blog posts:", error);
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
      <BlogPosts posts={posts} />
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Blog;
