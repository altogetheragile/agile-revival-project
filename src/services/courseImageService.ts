
import { getGlobalCacheBust, applyCacheBustToUrl } from "@/utils/cacheBusting";
import { CourseImageSettings } from "@/types/courseImage";

// Apply cache busting only to images that don't already have it
export const applyCacheBustToImage = applyCacheBustToUrl;

export const applyImageSettings = (
  currentSettings: CourseImageSettings,
  newSettings: Partial<CourseImageSettings>
): CourseImageSettings => {
  // Apply cache busting if image URL has changed and doesn't already have cache busting
  const imageUrlWithCache = newSettings.imageUrl !== currentSettings.imageUrl ? 
    applyCacheBustToUrl(newSettings.imageUrl) : newSettings.imageUrl || currentSettings.imageUrl;

  return {
    imageUrl: imageUrlWithCache || currentSettings.imageUrl || "",
    imageAspectRatio: newSettings.imageAspectRatio || currentSettings.imageAspectRatio || "16/9",
    imageSize: newSettings.imageSize !== undefined ? newSettings.imageSize : (currentSettings.imageSize !== undefined ? currentSettings.imageSize : 100),
    imageLayout: newSettings.imageLayout || currentSettings.imageLayout || "standard"
  };
};
