
import { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import BlogForm from "@/components/blog/BlogForm";
import { BlogPost, BlogPostFormData } from "@/types/blog";
import { 
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById
} from "@/services/blogService";

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<BlogPostFormData | undefined>(undefined);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  // Load blog posts with drafts
  useEffect(() => {
    const loadedPosts = getAllBlogPosts(true);
    setPosts(loadedPosts);
  }, []);

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
        setPosts(getAllBlogPosts(true));
      }
    } else {
      // Create new post
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Blog Management</h2>
        <Button 
          onClick={handleAddNew} 
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} /> Add New Post
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-md p-4 relative">
            <div className="absolute top-2 right-2 flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => handleEdit(post.id)}>
                <Pencil size={16} />
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteConfirm(post.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
            
            <div className="pt-8">
              <h3 className="font-semibold text-lg">{post.title}</h3>
              <p className="text-sm text-gray-500">
                {post.date} • {post.isDraft ? 'Draft' : 'Published'}
              </p>
              <p className="mt-2 line-clamp-2">{post.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No blog posts found. Click "Add New Post" to create one.
        </div>
      )}

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
    </div>
  );
};

export default BlogManagement;
