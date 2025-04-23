import { BlogPost, BlogPostFormData } from "@/types/blog";
import { blogPosts as initialBlogPosts } from "@/data/blogPosts";

// We'll use localStorage to persist blog posts
const BLOG_STORAGE_KEY = 'agile-trainer-blog-posts';

// Load blog posts from localStorage or use initial data
const loadBlogPosts = (): BlogPost[] => {
  const storedPosts = localStorage.getItem(BLOG_STORAGE_KEY);
  return storedPosts ? JSON.parse(storedPosts) : [...initialBlogPosts];
};

// Save blog posts to localStorage
const saveBlogPosts = (posts: BlogPost[]): void => {
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
};

// Get all blog posts (excluding drafts unless specified)
export const getAllBlogPosts = (includeDrafts = false): BlogPost[] => {
  const posts = loadBlogPosts();
  return includeDrafts ? posts : posts.filter(post => !post.isDraft);
};

// Get a single blog post by ID
export const getBlogPostById = (id: number): BlogPost | undefined => {
  const posts = loadBlogPosts();
  return posts.find(post => post.id === id);
};

// Create a new blog post
export const createBlogPost = (postData: BlogPostFormData): BlogPost => {
  const posts = loadBlogPosts();
  
  // Generate a new ID (highest existing ID + 1)
  const newId = posts.length > 0 
    ? Math.max(...posts.map(post => post.id)) + 1 
    : 1;
  
  // Create the new post with the current date and explicit image properties
  const newPost: BlogPost = {
    id: newId,
    title: postData.title,
    content: postData.content,
    url: postData.url,
    date: postData.date || new Date().toISOString().split('T')[0],
    isDraft: postData.isDraft !== undefined ? postData.isDraft : true,
    // Explicitly include ALL image settings
    imageUrl: postData.imageUrl || "",
    imageAspectRatio: postData.imageAspectRatio || "16/9",
    imageSize: postData.imageSize || 100,
    imageLayout: postData.imageLayout || "standard"
  };
  
  // Add the new post to the collection and save
  posts.push(newPost);
  saveBlogPosts(posts);
  
  return newPost;
};

// Update an existing blog post
export const updateBlogPost = (id: number, postData: BlogPostFormData): BlogPost | null => {
  const posts = loadBlogPosts();
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Get original post to maintain any fields not provided in update
  const originalPost = posts[index];
  
  // Update the blog post with new data while preserving ID and date
  const updatedPost: BlogPost = {
    ...originalPost,
    title: postData.title !== undefined ? postData.title : originalPost.title,
    content: postData.content !== undefined ? postData.content : originalPost.content,
    url: postData.url !== undefined ? postData.url : originalPost.url,
    isDraft: postData.isDraft !== undefined ? postData.isDraft : originalPost.isDraft,
    // Explicitly handle image properties to prevent them from becoming undefined
    imageUrl: postData.imageUrl !== undefined ? postData.imageUrl : originalPost.imageUrl,
    imageAspectRatio: postData.imageAspectRatio || originalPost.imageAspectRatio || "16/9",
    imageSize: postData.imageSize || originalPost.imageSize || 100,
    imageLayout: postData.imageLayout || originalPost.imageLayout || "standard",
    // Keep original ID and date
    id: id,
    date: originalPost.date
  };
  
  // Update the post in the array
  posts[index] = updatedPost;
  saveBlogPosts(posts);
  
  return updatedPost;
};

// Delete a blog post
export const deleteBlogPost = (id: number): boolean => {
  const posts = loadBlogPosts();
  const filteredPosts = posts.filter(post => post.id !== id);
  
  if (filteredPosts.length === posts.length) {
    // No post was removed
    return false;
  }
  
  saveBlogPosts(filteredPosts);
  return true;
};
