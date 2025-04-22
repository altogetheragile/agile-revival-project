
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * This component initializes and validates the storage buckets needed by the app
 * It should be mounted once early in the application lifecycle
 */
const StorageInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkStorageBuckets = async () => {
      try {
        console.log("Checking for required storage buckets...");
        
        // Directly try to list files from the media bucket to verify it exists and is accessible
        const { data: files, error: filesError } = await supabase.storage
          .from("media")
          .list("", { limit: 1 });
        
        if (filesError) {
          console.error("Failed to access media bucket:", filesError.message);
          
          if (filesError.message.includes("does not exist") || 
              filesError.message.includes("not found")) {
            console.log("Media bucket doesn't exist. Create it in the Supabase dashboard.");
            toast({
              title: "Media Storage Required",
              description: "Please create a 'media' bucket in your Supabase project and set it to public.",
              duration: 10000,
              variant: "destructive"
            });
          } else {
            toast({
              title: "Storage Access Error",
              description: "Could not access the media storage. Check permissions in your Supabase project.",
              duration: 10000,
              variant: "destructive"
            });
          }
        } else {
          console.log("Media bucket exists and is accessible!", files);
          toast({
            title: "Media Storage Connected",
            description: "Successfully connected to the media storage bucket.",
            duration: 5000,
          });
        }
        
        // Set as initialized to allow the app to function
        setInitialized(true);
      } catch (err) {
        console.error("Error checking storage buckets:", err);
        toast({
          title: "Storage Connection Error",
          description: "An unexpected error occurred. Check your browser console for details.",
          duration: 7000,
          variant: "destructive"
        });
        // Still set initialized to true to allow the app to function
        setInitialized(true);
      }
    };

    checkStorageBuckets();
  }, [toast]);

  return null; // This component doesn't render anything
};

export default StorageInitializer;
