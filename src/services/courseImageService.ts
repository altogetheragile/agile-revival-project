
import { getGlobalCacheBust } from "@/utils/courseStorage";
import { CourseImageSettings } from "@/types/courseImage";

export const applyCacheBustToImage = (imageUrl: string | undefined): string => {
  if (!imageUrl) return "";
  
  // Strip any existing cache busting params
  const baseUrl = imageUrl.split('?')[0];
  // Apply new cache busting param
  const cacheBust = getGlobalCacheBust();
  return `${baseUrl}?v=${cacheBust}`;
};

export const applyImageSettings = (
  currentSettings: CourseImageSettings,
  newSettings: Partial<CourseImageSettings>
): CourseImageSettings => {
  // Apply cache busting if image URL has changed
  const imageUrlWithCache = newSettings.imageUrl !== currentSettings.imageUrl ? 
    applyCacheBustToImage(newSettings.imageUrl) : newSettings.imageUrl || currentSettings.imageUrl;

  return {
    imageUrl: imageUrlWithCache || currentSettings.imageUrl || "",
    imageAspectRatio: newSettings.imageAspectRatio || currentSettings.imageAspectRatio || "16/9",
    imageSize: newSettings.imageSize !== undefined ? newSettings.imageSize : (currentSettings.imageSize !== undefined ? currentSettings.imageSize : 100),
    imageLayout: newSettings.imageLayout || currentSettings.imageLayout || "standard"
  };
};
