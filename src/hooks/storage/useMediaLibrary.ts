
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
        const urls = data
          .filter((f) => f.name.match(/\.(jpe?g|png|gif|webp|svg)$/i))
          .map((f) => ({
            name: f.name,
            url: supabase.storage.from("media").getPublicUrl(f.name).data.publicUrl,
          }));
        setItems(urls);
      }
    } catch (error) {
      console.error("Error in fetchMedia:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const upload = async (file: File) => {
    setLoading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      
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
      
      // Fetch updated media list after successful upload
      await fetchMedia();
      
      return { data };
    } catch (error: any) {
      console.error("Error in upload:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, upload, fetchMedia };
};
