
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Represents an image object from storage
export interface MediaItem {
  name: string;
  url: string;
  type: string;
}

export const useMediaLibrary = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [bucketExists, setBucketExists] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBucketExists = useCallback(async () => {
    try {
      console.log("Checking if media bucket exists...");
      
      // Try to list files directly from the media bucket
      const { data, error: listError } = await supabase.storage
        .from("media")
        .list("", { limit: 1 });
      
      if (listError) {
        console.error("Error accessing media bucket:", listError.message);
        setError(`Media bucket error: ${listError.message}`);
        setBucketExists(false);
        return false;
      }
      
      // If we get here, the bucket exists and is accessible
      console.log("Media bucket exists and is accessible:", data);
      setBucketExists(true);
      setError(null);
      return true;
    } catch (err) {
      console.error("Exception checking bucket:", err);
      setError("Connection error: " + (err instanceof Error ? err.message : String(err)));
      setBucketExists(false);
      return false;
    }
  }, []);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // First check if bucket exists and is accessible
      const exists = await checkBucketExists();
      
      if (!exists) {
        console.log("Media bucket doesn't exist or isn't accessible");
        setLoading(false);
        return;
      }
      
      console.log("Fetching media from Supabase storage...");
      const { data, error } = await supabase.storage.from("media").list("", { 
        limit: 100,
        sortBy: { column: 'name', order: 'desc' }
      });
      
      if (error) {
        console.error("Error fetching media:", error);
        setError("Failed to list media files: " + error.message);
        setLoading(false);
        return;
      }
      
      if (data) {
        console.log("Media data retrieved:", data.length, "items");
        // Support multiple media types
        const supportedMediaPattern = /\.(jpe?g|png|gif|webp|svg|mp3|wav|ogg|mp4|webm|mpeg)$/i;
        
        const mediaItems = data
          .filter((f) => !f.id.includes('/')) // Filter out folders
          .filter((f) => f.name.match(supportedMediaPattern))
          .map((f) => {
            // Determine file type based on extension
            const extension = f.name.split('.').pop()?.toLowerCase() || '';
            let type = 'other';
            
            if (/jpe?g|png|gif|webp|svg/i.test(extension)) {
              type = 'image';
            } else if (/mp3|wav|ogg|mpeg/i.test(extension)) {
              type = 'audio';
            } else if (/mp4|webm/i.test(extension)) {
              type = 'video';
            }
            
            const url = supabase.storage.from("media").getPublicUrl(f.name).data.publicUrl;
            console.log(`Media item: ${f.name}, URL: ${url}`);
            
            return {
              name: f.name,
              url: url,
              type
            };
          });
          
        setItems(mediaItems);
        console.log("Processed media items:", mediaItems.length);
      }
    } catch (error) {
      console.error("Exception in fetchMedia:", error);
      setError("Failed to load media: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  }, [checkBucketExists]);

  useEffect(() => {
    console.log("Media library hook initialized, fetching media...");
    fetchMedia();
  }, [fetchMedia]);

  const upload = async (file: File) => {
    console.log("Uploading file:", file.name, "size:", file.size);
    setLoading(true);
    try {
      // Check if bucket exists and is accessible
      const exists = await checkBucketExists();
      if (!exists) {
        console.log("Media bucket doesn't exist or isn't accessible, cannot upload");
        return { 
          error: new Error("Media storage bucket is not accessible. Please make sure a 'media' bucket exists in your Supabase project and is set to public.") 
        };
      }
      
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      console.log("Generated filename:", fileName);
      
      // Use upsert option to handle potential conflicts
      const { data, error } = await supabase.storage
        .from("media")
        .upload(fileName, file, {
          upsert: true,
          cacheControl: "3600"
        });
      
      if (error) {
        console.error("Upload error:", error);
        return { error };
      }
      
      console.log("Upload successful:", data);
      
      // Fetch updated media list after successful upload
      await fetchMedia();
      
      return { data };
    } catch (error: any) {
      console.error("Exception in upload function:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, upload, fetchMedia, bucketExists, error };
};
