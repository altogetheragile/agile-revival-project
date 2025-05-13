
import { useState, useEffect } from 'react';
import { BlogPost, BlogPostFormData } from "@/types/blog";
import { 
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById
} from "@/services/blogService";
import { toast } from "sonner";

export const useBlogManagement = () => {
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

  return {
    blogPosts,
    filteredPosts,
    searchTerm,
    setSearchTerm,
    isLoading,
    isError,
    errorMessage,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentPostId,
    currentBlogPost,
    isRefreshing,
    isSeedDataVisible,
    loadBlogPosts,
    handleRefresh,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleSave
  };
};
