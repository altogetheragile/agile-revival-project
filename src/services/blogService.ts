
import { BlogPost, BlogPostFormData } from "@/types/blog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get all blog posts (excluding drafts unless specified)
export const getAllBlogPosts = async (includeDrafts = false): Promise<BlogPost[]> => {
  try {
    let query = supabase.from('blog_posts').select('*');
    
    if (!includeDrafts) {
      query = query.eq('is_draft', false);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to load blog posts");
      return [];
    }
    
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
    toast.error("Failed to load blog posts");
    return [];
  }
};

// Get a single blog post by ID
export const getBlogPostById = async (id: string): Promise<BlogPost | undefined> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching blog post by ID:", error);
      return undefined;
    }
    
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
    return undefined;
  }
};

// Create a new blog post
export const createBlogPost = async (postData: BlogPostFormData): Promise<BlogPost | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    console.log("Creating blog post with image settings:", {
      imageUrl: postData.imageUrl,
      aspectRatio: postData.imageAspectRatio,
      size: postData.imageSize,
      layout: postData.imageLayout
    });
    
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
      toast.error("Failed to create blog post");
      return null;
    }
    
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
    toast.error("Failed to create blog post");
    return null;
  }
};

// Update an existing blog post
export const updateBlogPost = async (id: string, postData: BlogPostFormData): Promise<BlogPost | null> => {
  try {
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
    
    console.log("Updating blog post with image settings:", {
      imageUrl: updates.image_url,
      imageAspectRatio: updates.image_aspect_ratio,
      imageSize: updates.image_size,
      imageLayout: updates.image_layout
    });
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating blog post:", error);
      toast.error("Failed to update blog post");
      return null;
    }
    
    console.log("Blog post updated successfully:", data);
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
    toast.error("Failed to update blog post");
    return null;
  }
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Failed to delete blog post");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    toast.error("Failed to delete blog post");
    return false;
  }
};
