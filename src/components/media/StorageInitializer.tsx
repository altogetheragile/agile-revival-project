
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
    const initializeStorage = async () => {
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
          console.log("Media bucket doesn't exist, attempting to create it...");
          try {
            const { data, error: createError } = await supabase.storage.createBucket('media', {
              public: true,
              fileSizeLimit: 5242880, // 5MB
              allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
            });
            
            if (createError) {
              console.error("Failed to create media bucket:", createError);
              toast({
                title: "Storage setup failed",
                description: "Could not create the media storage bucket. Please check your connection.",
                variant: "destructive",
              });
            } else {
              console.log("Media bucket created successfully");
              // Create policy to allow public access to media files
              const { error: policyError } = await supabase.storage.from('media').createPolicy('public-read', {
                type: 'download',
                definition: {
                  role: '*'
                }
              });
              
              if (policyError) {
                console.error("Failed to create media bucket policy:", policyError);
              } else {
                console.log("Media bucket policy created successfully");
                setInitialized(true);
              }
            }
          } catch (err) {
            console.error("Exception while creating media bucket:", err);
          }
        } else {
          console.log("Media bucket already exists");
          setInitialized(true);
        }
      } catch (err) {
        console.error("Error in storage initialization:", err);
      }
    };

    initializeStorage();
  }, [toast]);

  return null; // This component doesn't render anything
};

export default StorageInitializer;
