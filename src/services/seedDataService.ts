
import { supabase } from "@/integrations/supabase/client";
import { blogPosts } from "@/data/blogPosts";
import { toast } from "sonner";

/**
 * Seeds the blog_posts table with initial data if it's empty
 */
export const seedBlogPosts = async (): Promise<boolean> => {
  try {
    // Check if the table is empty
    const { count, error: countError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error("Error checking blog posts count:", countError);
      return false;
    }
    
    if (count && count > 0) {
      console.log(`Blog posts table already has ${count} entries, skipping seed`);
      return true;
    }
    
    console.log("No blog posts found, seeding initial data");
    
    // Map mock data to database format
    const posts = blogPosts.map(post => ({
      title: post.title,
      content: post.content,
      url: post.url || "",
      date: post.date,
      is_draft: post.isDraft || false,
      image_url: post.imageUrl || "",
      image_aspect_ratio: post.imageAspectRatio || "16/9",
      image_size: post.imageSize || 100,
      image_layout: post.imageLayout || "standard"
    }));
    
    // Insert seed data
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(posts);
    
    if (error) {
      console.error("Error seeding blog posts:", error);
      toast.error("Error seeding blog posts");
      return false;
    }
    
    console.log("Successfully seeded blog posts");
    return true;
  } catch (error) {
    console.error("Unexpected error seeding blog posts:", error);
    return false;
  }
};

/**
 * Seeds all tables with initial data
 */
export const seedAllData = async (): Promise<void> => {
  try {
    console.log("Starting data seeding process");
    
    await seedBlogPosts();
    
    console.log("Data seeding complete");
  } catch (error) {
    console.error("Error in seedAllData:", error);
  }
};
