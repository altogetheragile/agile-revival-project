
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

  const checkBucketExists = useCallback(async () => {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error("Error checking buckets:", error);
      return false;
    }
    return buckets?.some(bucket => bucket.name === "media") || false;
  }, []);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      // First check if bucket exists
      const exists = await checkBucketExists();
      setBucketExists(exists);
      
      if (!exists) {
        console.log("Media bucket doesn't exist, cannot fetch media items");
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
        setLoading(false);
        return;
      }
      
      if (data) {
        console.log("Media data retrieved:", data.length, "items");
        // Support multiple media types
        const supportedMediaPattern = /\.(jpe?g|png|gif|webp|svg|mp3|wav|ogg|mp4|webm|mpeg)$/i;
        
        const mediaItems = data
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
            
            return {
              name: f.name,
              url: supabase.storage.from("media").getPublicUrl(f.name).data.publicUrl,
              type
            };
          });
          
        setItems(mediaItems);
        console.log("Processed media items:", mediaItems.length);
      }
    } catch (error) {
      console.error("Exception in fetchMedia:", error);
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
      // Check if bucket exists first
      const exists = await checkBucketExists();
      if (!exists) {
        console.log("Media bucket doesn't exist, cannot upload");
        return { error: new Error("Media storage bucket doesn't exist. Please create it in your Supabase dashboard.") };
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

  return { items, loading, upload, fetchMedia, bucketExists };
};
