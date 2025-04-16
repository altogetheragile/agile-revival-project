
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

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<BlogPostFormData | undefined>(undefined);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadedPosts = getAllBlogPosts(true);
    setPosts(loadedPosts);
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

  const handleEdit = (id: number) => {
    const post = getBlogPostById(id);
    if (post) {
      setCurrentPost(post);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteConfirm = (id: number) => {
    setDeleteId(id);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      const success = deleteBlogPost(deleteId);
      if (success) {
        toast({
          title: "Post deleted",
          description: "The blog post has been deleted successfully.",
        });
        setPosts(getAllBlogPosts(true));
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

  const handleSubmit = (data: BlogPostFormData) => {
    if (currentPost?.id) {
      const updatedPost = updateBlogPost(currentPost.id, data);
      if (updatedPost) {
        toast({
          title: "Post updated",
          description: "The blog post has been updated successfully.",
        });
        setPosts(getAllBlogPosts(true));
      }
    } else {
      const newPost = createBlogPost(data);
      toast({
        title: "Post created",
        description: "The blog post has been created successfully.",
      });
      setPosts(getAllBlogPosts(true));
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <BlogManagementHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddNew}
      />
      
      <BlogPostGrid
        posts={filteredPosts}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirm}
      />
      
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
