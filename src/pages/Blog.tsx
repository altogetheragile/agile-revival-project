
import React, { useState, useEffect } from 'react';
import { ExternalLink, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import BlogPostCard from "@/components/blog/BlogPostCard";
import BlogForm from "@/components/blog/BlogForm";
import { BlogPost, BlogPostFormData } from "@/types/blog";
import { 
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById
} from "@/services/blogService";
import { useToast } from "@/components/ui/use-toast";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showManagement, setShowManagement] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<BlogPostFormData | undefined>(undefined);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  // Load blog posts
  useEffect(() => {
    const loadedPosts = getAllBlogPosts(showManagement);
    setPosts(loadedPosts);
  }, [showManagement]);

  // Toggle management mode
  const toggleManagement = () => {
    setShowManagement(!showManagement);
  };

  // Open dialog to create a new post
  const handleAddNew = () => {
    setCurrentPost(undefined);
    setIsDialogOpen(true);
  };

  // Open dialog to edit a post
  const handleEdit = (id: number) => {
    const post = getBlogPostById(id);
    if (post) {
      setCurrentPost(post);
      setIsDialogOpen(true);
    }
  };

  // Open confirmation dialog for deletion
  const handleDeleteConfirm = (id: number) => {
    setDeleteId(id);
    setIsConfirmDialogOpen(true);
  };

  // Delete a post after confirmation
  const handleDelete = () => {
    if (deleteId !== null) {
      const success = deleteBlogPost(deleteId);
      if (success) {
        toast({
          title: "Post deleted",
          description: "The blog post has been deleted successfully.",
        });
        // Refresh the posts list
        setPosts(getAllBlogPosts(showManagement));
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the blog post.",
          variant: "destructive",
        });
      }
      setIsConfirmDialogOpen(false);
      setDeleteId(null);
    }
  };

  // Handle form submission for creating/editing posts
  const handleSubmit = (data: BlogPostFormData) => {
    if (currentPost?.id) {
      // Update existing post
      const updatedPost = updateBlogPost(currentPost.id, data);
      if (updatedPost) {
        toast({
          title: "Post updated",
          description: "The blog post has been updated successfully.",
        });
        setPosts(getAllBlogPosts(showManagement));
      }
    } else {
      // Create new post
      const newPost = createBlogPost(data);
      toast({
        title: "Post created",
        description: "The blog post has been created successfully.",
      });
      setPosts(getAllBlogPosts(showManagement));
    }
    setIsDialogOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center">Blog</h1>
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={toggleManagement}
            >
              {showManagement ? 'View Published' : 'Manage Posts'}
            </Button>
          </div>
          <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-8">
            Insights, tips, and stories about agile methodology, product management, and team leadership
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {showManagement && (
          <div className="mb-6 flex justify-end">
            <Button 
              onClick={handleAddNew} 
              className="flex items-center gap-2"
            >
              <PlusCircle size={16} /> Add New Post
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="relative">
              {showManagement && (
                <div className="absolute top-2 right-2 z-10 flex gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-md shadow-md">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(post.id)}>
                    <Pencil size={16} />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteConfirm(post.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
              <BlogPostCard post={post} />
              {post.isDraft && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  Draft
                </div>
              )}
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              {showManagement 
                ? "No posts yet. Click 'Add New Post' to create your first blog post." 
                : "No published posts yet. Check back soon!"}
            </p>
          </div>
        )}
      </div>

      {/* Blog Post Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentPost?.id ? 'Edit Blog Post' : 'Create Blog Post'}</DialogTitle>
            <DialogDescription>
              {currentPost?.id 
                ? 'Update the details of your existing blog post' 
                : 'Fill out the form to create a new blog post'}
            </DialogDescription>
          </DialogHeader>
          <BlogForm 
            initialData={currentPost} 
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Blog;
