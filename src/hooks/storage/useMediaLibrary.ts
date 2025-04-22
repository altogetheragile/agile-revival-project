
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Represents an image object from storage
export interface MediaItem {
  name: string;
  url: string;
}

export const useMediaLibrary = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
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
        const urls = data
          .filter((f) => f.name.match(/\.(jpe?g|png|gif|webp|svg)$/i))
          .map((f) => ({
            name: f.name,
            url: supabase.storage.from("media").getPublicUrl(f.name).data.publicUrl,
          }));
        setItems(urls);
        console.log("Processed media items:", urls.length);
      }
    } catch (error) {
      console.error("Exception in fetchMedia:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Media library hook initialized, fetching media...");
    fetchMedia();
  }, [fetchMedia]);

  const upload = async (file: File) => {
    console.log("Uploading file:", file.name, "size:", file.size);
    setLoading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      console.log("Generated filename:", fileName);
      
      // Check if storage bucket exists
      console.log("Checking for media bucket...");
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error("Failed to list storage buckets:", bucketError);
        return { error: bucketError };
      }
      
      const mediaBucketExists = buckets?.some(bucket => bucket.name === "media");
      console.log("Media bucket exists:", mediaBucketExists);
      
      if (!mediaBucketExists) {
        console.error("Media bucket does not exist - this should be created by the Supabase setup");
        return { error: new Error("Media storage is not configured correctly. Please contact support.") };
      }
      
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

  return { items, loading, upload, fetchMedia };
};
