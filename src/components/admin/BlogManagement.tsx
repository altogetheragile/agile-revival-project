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
import { seedBlogPosts } from "@/services/seedDataService";
import BlogForm from "@/components/blog/BlogForm";
import { BlogManagementHeader } from "./blog/BlogManagementHeader";
import { BlogPostGrid } from "./blog/BlogPostGrid";
import { DeleteConfirmationDialog } from "./users/DeleteConfirmationDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, PlusCircle, Database } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const BlogManagement = () => {
  // State management
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSeedDataVisible, setIsSeedDataVisible] = useState(false);
  const [currentBlogPost, setCurrentBlogPost] = useState<BlogPostFormData | undefined>(undefined);

  const { isAdmin, user } = useAuth();

  // Load blog posts on component mount
  useEffect(() => {
    loadBlogPosts();
    // Only show seed button if no posts are found
    setIsSeedDataVisible(true);
  }, []);

  // Fetch blog post data when currentPostId changes
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (currentPostId) {
        try {
          const post = await getBlogPostById(currentPostId);
          setCurrentBlogPost(post);
        } catch (error) {
          console.error("Error fetching blog post:", error);
          toast.error('Failed to load blog post details');
        }
      } else {
        // Reset current blog post when adding a new post
        setCurrentBlogPost(undefined);
      }
    };

    fetchBlogPost();
  }, [currentPostId]);

  // Filter posts based on search term
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load all blog posts from the database
  const loadBlogPosts = async (includeDrafts = true) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const posts = await getAllBlogPosts(includeDrafts);
      setBlogPosts(posts);
      setIsSeedDataVisible(posts.length === 0);
    } catch (error) {
      console.error("Error loading blog posts:", error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle refreshing the blog posts list
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadBlogPosts();
    setIsRefreshing(false);
  };

  // Handle adding a new blog post
  const handleAddNew = () => {
    setCurrentPostId(null);
    setIsDialogOpen(true);
  };

  // Handle editing a blog post
  const handleEdit = (id: string) => {
    setCurrentPostId(id);
    setIsDialogOpen(true);
  };

  // Handle deleting a blog post
  const handleDelete = (id: string) => {
    setCurrentPostId(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle confirming deletion of a blog post
  const handleConfirmDelete = async () => {
    if (!currentPostId) return;
    
    try {
      const success = await deleteBlogPost(currentPostId);
      if (success) {
        // Remove the deleted post from the state
        setBlogPosts(prevPosts => prevPosts.filter(post => post.id !== currentPostId));
        toast.success('Blog post deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error('Failed to delete blog post');
    } finally {
      setIsDeleteDialogOpen(false);
      setCurrentPostId(null);
    }
  };

  // Handle saving a blog post (add or edit)
  const handleSave = async (formData: BlogPostFormData) => {
    try {
      if (currentPostId) {
        // Update existing post
        const updatedPost = await updateBlogPost(currentPostId, formData);
        if (updatedPost) {
          setBlogPosts(prevPosts => 
            prevPosts.map(post => post.id === currentPostId ? updatedPost : post)
          );
          toast.success('Blog post updated successfully');
        }
      } else {
        // Create new post
        const newPost = await createBlogPost(formData);
        if (newPost) {
          setBlogPosts(prevPosts => [...prevPosts, newPost]);
          toast.success('Blog post created successfully');
        }
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast.error('Failed to save blog post');
    }
  };

  // Handle seeding sample blog posts
  const handleSeedData = async () => {
    try {
      if (!user) {
        toast.error('User not authenticated');
        return;
      }
      
      await seedBlogPosts(user.id);
      toast.success('Sample blog posts added successfully');
      await handleRefresh();
    } catch (error) {
      console.error("Error seeding blog posts:", error);
      toast.error('Failed to seed blog posts');
    }
  };

  // Loading state
  if (isLoading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-6 border border-red-200 bg-red-50 rounded-lg">
        <div className="flex items-center mb-4">
          <AlertTriangle className="text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-red-700">Error Loading Blog Posts</h3>
        </div>
        <p className="text-red-600 mb-4">{errorMessage || 'Failed to load blog posts. Please try again.'}</p>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isRefreshing}
        >
          <RefreshCw className={`${isRefreshing ? 'animate-spin' : ''} h-4 w-4`} />
          {isRefreshing ? 'Refreshing...' : 'Try Again'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with search and actions */}
      <BlogManagementHeader 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        onAddNew={handleAddNew}
        onSeedData={handleSeedData}
        showSeedButton={isAdmin && isSeedDataVisible}
      />

      {/* Blog post grid */}
      <div className="relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        <BlogPostGrid 
          posts={filteredPosts} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>

      {/* Form dialog for adding/editing blog posts */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentPostId ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
            <DialogDescription>
              {currentPostId 
                ? 'Update the details of the selected blog post.' 
                : 'Fill in the details to create a new blog post.'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="p-1">
              <BlogForm 
                initialData={currentBlogPost} 
                onSubmit={handleSave} 
                onCancel={() => setIsDialogOpen(false)}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => setIsDeleteDialogOpen(open)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
