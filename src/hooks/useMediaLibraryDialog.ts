
import { useState } from "react";
import { Course } from "@/types/course";

export const useMediaLibraryDialog = (currentCourse: Course | null) => {
  const [mediaLibOpen, setMediaLibOpen] = useState(false);
  const [formData, setFormData] = useState<Course | null>(null);

  const handleMediaSelect = (url: string, aspectRatio?: string, size?: number, layout?: string) => {
    if (currentCourse) {
      setFormData({
        ...currentCourse,
        imageUrl: url,
        imageAspectRatio: aspectRatio || "16/9",
        imageSize: size || 100,
        imageLayout: layout || "standard"
      });
    }
    setMediaLibOpen(false);
  };

  return {
    mediaLibOpen,
    setMediaLibOpen,
    formData,
    setFormData,
    handleMediaSelect
  };
};
