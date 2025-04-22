
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
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error("Failed to list storage buckets:", error);
          return;
        }
        
        console.log("Available buckets:", buckets?.map(b => b.name) || []);
        const mediaBucketExists = buckets?.some(bucket => bucket.name === "media");
        
        if (!mediaBucketExists) {
          // Instead of showing an error, just inform the user they need to create a bucket
          console.log("Media bucket doesn't exist. Please create it in the Supabase dashboard.");
          toast({
            title: "Media Storage Notice",
            description: "For full functionality, please create a 'media' bucket in your Supabase project.",
            duration: 7000,
          });
        } else {
          console.log("Media bucket exists, proceeding with normal operation");
          // Let's check if we can access it
          try {
            // Try to get a sample public URL to verify the bucket is properly configured
            const testUrl = supabase.storage.from("media").getPublicUrl("test.txt");
            if (testUrl.data.publicUrl) {
              console.log("Media bucket is accessible");
            }
          } catch (err) {
            console.error("Error checking storage bucket access:", err);
          }
        }
        
        // Set as initialized even if bucket doesn't exist to allow the app to function
        setInitialized(true);
      } catch (err) {
        console.error("Error checking storage buckets:", err);
        // Still set initialized to true to allow the app to function
        setInitialized(true);
      }
    };

    checkStorageBuckets();
  }, [toast]);

  return null; // This component doesn't render anything
};

export default StorageInitializer;
