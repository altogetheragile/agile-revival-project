
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

  // Load blog posts
  useEffect(() => {
    const loadedPosts = getAllBlogPosts();
    setPosts(loadedPosts);
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
