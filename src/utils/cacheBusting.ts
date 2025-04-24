
/**
 * Simple utility for cache busting without relying on localStorage
 */

// Generate a unique timestamp for the session
const GLOBAL_CACHE_BUST = Date.now().toString();

/**
 * Returns the current global cache bust value
 */
export const getGlobalCacheBust = (): string => {
  return GLOBAL_CACHE_BUST;
};

/**
 * Applies cache busting to an image URL
 */
export const applyCacheBustToUrl = (url: string | undefined): string => {
  if (!url) return "";
  
  // Strip any existing cache busting params
  const baseUrl = url.split('?')[0];
  // Apply cache busting param
  return `${baseUrl}?v=${GLOBAL_CACHE_BUST}`;
};
