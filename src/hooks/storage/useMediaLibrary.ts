
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
    const { data, error } = await supabase.storage.from("media").list("", { limit: 100 });
    if (data) {
      const urls = data
        .filter((f) => f.name.match(/\.(jpe?g|png|gif|webp|svg)$/i))
        .map((f) => ({
          name: f.name,
          url: supabase.storage.from("media").getPublicUrl(f.name).data.publicUrl,
        }));
      setItems(urls);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const upload = async (file: File) => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from("media")
      .upload(`${Date.now()}-${file.name}`, file);
    if (!error) {
      await fetchMedia();
    }
    setLoading(false);
    return { error, data };
  };

  return { items, loading, upload, fetchMedia };
};
