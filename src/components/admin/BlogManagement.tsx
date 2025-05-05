
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlogPost, BlogPostFormData } from "@/types/blog";
import { 
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById
} from "@/services/blogService";
import BlogForm from "@/components/blog/BlogForm";
import { BlogManagementHeader } from "./blog/BlogManagementHeader";
import { BlogPostGrid } from "./blog/BlogPostGrid";
import { DeleteConfirmationDialog } from "./users/DeleteConfirmationDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<BlogPostFormData | undefined>(undefined);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();

  const loadPosts = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      console.log("Loading blog posts in BlogManagement component...");
      const loadedPosts = await getAllBlogPosts(true);
      console.log("Fetched blog posts:", loadedPosts);
      setPosts(loadedPosts);
    } catch (error) {
      console.error("Error loading blog posts:", error);
      setLoadError(error instanceof Error ? error.message : "Failed to load blog posts");
      toast.error("Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Filter posts based on search term
  const filteredPosts = posts.filter(post => {
    const searchLower = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    );
  });

  const handleAddNew = () => {
    setCurrentPost(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = async (id: string) => {
    try {
      console.log("Editing post with ID:", id);
      const post = await getBlogPostById(id);
      if (post) {
        setCurrentPost(post);
        setIsDialogOpen(true);
      } else {
        toast.error("Post not found");
      }
    } catch (error) {
      console.error("Error fetching post for editing:", error);
      toast.error("Failed to load post for editing");
    }
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        console.log("Deleting post with ID:", deleteId);
        const success = await deleteBlogPost(deleteId);
        if (success) {
          toast.success("Post deleted successfully");
          // Refresh posts list
          await loadPosts();
        } else {
          toast.error("Failed to delete the post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete post");
      } finally {
        setIsConfirmDialogOpen(false);
        setDeleteId(null);
      }
    }
  };

  const handleSubmit = async (data: BlogPostFormData) => {
    try {
      if (currentPost?.id) {
        console.log("Updating post with ID:", currentPost.id);
        const updatedPost = await updateBlogPost(currentPost.id, data);
        if (updatedPost) {
          toast.success("Post updated successfully");
          // Refresh posts list
          await loadPosts();
          setIsDialogOpen(false);
        }
      } else {
        console.log("Creating new post");
        const newPost = await createBlogPost(data);
        if (newPost) {
          toast.success("Post created successfully");
          // Refresh posts list
          await loadPosts();
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error("Failed to save post");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <BlogManagementHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddNew}
      />
      
      {loadError && (
        <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="font-medium">Error loading blog posts</h2>
          </div>
          <p className="mt-1 text-red-500">{loadError}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadPosts}
            className="mt-3 border-red-200 text-red-600 hover:bg-red-50"
          >
            <RefreshCw className="mr-1 h-3 w-3" /> Try Again
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <BlogPostGrid
          posts={filteredPosts}
          onEdit={handleEdit}
          onDelete={handleDeleteConfirm}
        />
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{currentPost?.id ? 'Edit Blog Post' : 'Create Blog Post'}</DialogTitle>
            <DialogDescription>
              {currentPost?.id 
                ? 'Update the details of your existing blog post' 
                : 'Fill out the form to create a new blog post'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <BlogForm 
              initialData={currentPost} 
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BlogManagement;
