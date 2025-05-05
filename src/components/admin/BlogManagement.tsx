
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

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<BlogPostFormData | undefined>(undefined);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast: uiToast } = useToast();

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const loadedPosts = await getAllBlogPosts(true);
        setPosts(loadedPosts);
      } catch (error) {
        console.error("Error loading blog posts:", error);
        toast.error("Failed to load blog posts");
      } finally {
        setIsLoading(false);
      }
    };

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
      const post = await getBlogPostById(id);
      if (post) {
        setCurrentPost(post);
        setIsDialogOpen(true);
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
      const success = await deleteBlogPost(deleteId);
      if (success) {
        toast.success("Post deleted successfully");
        // Refresh posts list
        const updatedPosts = await getAllBlogPosts(true);
        setPosts(updatedPosts);
      } else {
        toast.error("Failed to delete the post");
      }
      setIsConfirmDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleSubmit = async (data: BlogPostFormData) => {
    try {
      if (currentPost?.id) {
        const updatedPost = await updateBlogPost(currentPost.id, data);
        if (updatedPost) {
          toast.success("Post updated successfully");
          // Refresh posts list
          const updatedPosts = await getAllBlogPosts(true);
          setPosts(updatedPosts);
        }
      } else {
        const newPost = await createBlogPost(data);
        if (newPost) {
          toast.success("Post created successfully");
          // Refresh posts list
          const updatedPosts = await getAllBlogPosts(true);
          setPosts(updatedPosts);
        }
      }
      setIsDialogOpen(false);
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
