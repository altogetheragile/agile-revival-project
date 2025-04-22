
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface UploadResult {
  url?: string;
  error?: string;
}

type BucketType = "public" | "private";

export const useImageUploader = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (
    file: File,
    bucketType: BucketType = "public"
  ): Promise<UploadResult> => {
    setIsUploading(true);
    const bucket = bucketType === "public" ? "public-images" : "private-images";
    const fileExt = file.name.split('.').pop();
    const filePath = `${uuidv4()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    setIsUploading(false);

    if (error) {
      return { error: error.message };
    }

    // Get public URL if public, signed URL if private
    if (bucketType === "public") {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return { url: urlData.publicUrl };
    } else {
      const { data: signedData, error: signedErr } = await supabase
        .storage
        .from(bucket)
        .createSignedUrl(filePath, 60 * 60); // 1 hour

      if (signedErr) {
        return { error: signedErr.message };
      }
      return { url: signedData?.signedUrl };
    }
  };

  return {
    isUploading,
    uploadImage,
  };
};

