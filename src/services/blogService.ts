
import { BlogPost, BlogPostFormData } from "@/types/blog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get all blog posts (excluding drafts unless specified)
export const getAllBlogPosts = async (includeDrafts = false): Promise<BlogPost[]> => {
  try {
    console.log("Fetching blog posts from Supabase, includeDrafts:", includeDrafts);
    
    let query = supabase.from('blog_posts').select('*');
    
    if (!includeDrafts) {
      query = query.eq('is_draft', false);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error("Supabase error fetching blog posts:", error);
      throw new Error(`Failed to load blog posts: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log("No blog posts found in database, returning empty array");
      return [];
    }
    
    console.log("Successfully fetched blog posts:", data.length);
    
    return data.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      url: post.url || "",
      date: post.date,
      isDraft: post.is_draft,
      imageUrl: post.image_url || "",
      imageAspectRatio: post.image_aspect_ratio || "16/9",
      imageSize: post.image_size || 100,
      imageLayout: post.image_layout || "standard"
    }));
  } catch (error) {
    console.error("Unexpected error in getAllBlogPosts:", error);
    if (error instanceof Error) {
      toast.error(`Failed to load blog posts: ${error.message}`);
    } else {
      toast.error("Failed to load blog posts");
    }
    return [];
  }
};

// Get a single blog post by ID
export const getBlogPostById = async (id: string): Promise<BlogPost | undefined> => {
  try {
    console.log("Fetching blog post with ID:", id);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching blog post by ID:", error);
      toast.error(`Failed to load blog post: ${error.message}`);
      return undefined;
    }
    
    if (!data) {
      console.log("No blog post found with ID:", id);
      return undefined;
    }
    
    console.log("Successfully fetched blog post:", data);
    
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      url: data.url || "",
      date: data.date,
      isDraft: data.is_draft,
      imageUrl: data.image_url || "",
      imageAspectRatio: data.image_aspect_ratio || "16/9",
      imageSize: data.image_size || 100,
      imageLayout: data.image_layout || "standard"
    };
  } catch (error) {
    console.error("Unexpected error in getBlogPostById:", error);
    if (error instanceof Error) {
      toast.error(`Failed to load blog post: ${error.message}`);
    } else {
      toast.error("Failed to load blog post");
    }
    return undefined;
  }
};

// Create a new blog post
export const createBlogPost = async (postData: BlogPostFormData): Promise<BlogPost | null> => {
  try {
    console.log("Creating new blog post with data:", postData);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const newPost = {
      title: postData.title,
      content: postData.content,
      url: postData.url || "",
      date: postData.date || new Date().toISOString().split('T')[0],
      is_draft: postData.isDraft !== undefined ? postData.isDraft : true,
      image_url: postData.imageUrl || "",
      image_aspect_ratio: postData.imageAspectRatio || "16/9",
      image_size: postData.imageSize || 100,
      image_layout: postData.imageLayout || "standard",
      created_by: user?.id
    };
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([newPost])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating blog post:", error);
      toast.error(`Failed to create blog post: ${error.message}`);
      return null;
    }
    
    console.log("Successfully created blog post:", data);
    toast.success("Blog post created successfully");
    
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      url: data.url || "",
      date: data.date,
      isDraft: data.is_draft,
      imageUrl: data.image_url || "",
      imageAspectRatio: data.image_aspect_ratio || "16/9",
      imageSize: data.image_size || 100,
      imageLayout: data.image_layout || "standard"
    };
  } catch (error) {
    console.error("Unexpected error in createBlogPost:", error);
    if (error instanceof Error) {
      toast.error(`Failed to create blog post: ${error.message}`);
    } else {
      toast.error("Failed to create blog post");
    }
    return null;
  }
};

// Update an existing blog post
export const updateBlogPost = async (id: string, postData: BlogPostFormData): Promise<BlogPost | null> => {
  try {
    console.log("Updating blog post with ID:", id, "with data:", postData);
    
    const updates = {
      title: postData.title,
      content: postData.content,
      url: postData.url || "",
      is_draft: postData.isDraft !== undefined ? postData.isDraft : true,
      image_url: postData.imageUrl || "",
      image_aspect_ratio: postData.imageAspectRatio || "16/9",
      image_size: postData.imageSize !== undefined ? postData.imageSize : 100,
      image_layout: postData.imageLayout || "standard",
    };
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating blog post:", error);
      toast.error(`Failed to update blog post: ${error.message}`);
      return null;
    }
    
    console.log("Blog post updated successfully:", data);
    toast.success("Blog post updated successfully");
    
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      url: data.url || "",
      date: data.date,
      isDraft: data.is_draft,
      imageUrl: data.image_url || "",
      imageAspectRatio: data.image_aspect_ratio || "16/9",
      imageSize: data.image_size || 100,
      imageLayout: data.image_layout || "standard"
    };
  } catch (error) {
    console.error("Error updating blog post:", error);
    if (error instanceof Error) {
      toast.error(`Failed to update blog post: ${error.message}`);
    } else {
      toast.error("Failed to update blog post");
    }
    return null;
  }
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting blog post with ID:", id);
    
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting blog post:", error);
      toast.error(`Failed to delete blog post: ${error.message}`);
      return false;
    }
    
    console.log("Blog post deleted successfully");
    toast.success("Blog post deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    if (error instanceof Error) {
      toast.error(`Failed to delete blog post: ${error.message}`);
    } else {
      toast.error("Failed to delete blog post");
    }
    return false;
  }
};
