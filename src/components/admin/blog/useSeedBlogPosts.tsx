
import { useAuth } from "@/contexts/AuthContext";
import { seedBlogPosts } from "@/services/seedDataService";
import { toast } from "sonner";

export const useSeedBlogPosts = (onSuccess: () => void) => {
  const { user } = useAuth();

  const handleSeedData = async () => {
    try {
      if (!user) {
        toast.error('User not authenticated');
        return;
      }
      
      await seedBlogPosts(user.id);
      toast.success('Sample blog posts added successfully');
      onSuccess();
    } catch (error) {
      console.error("Error seeding blog posts:", error);
      toast.error('Failed to seed blog posts');
    }
  };

  return { handleSeedData };
};
