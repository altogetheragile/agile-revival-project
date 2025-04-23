
const STORAGE_VERSION_KEY = 'agile-trainer-storage-version';
const GLOBAL_CACHE_BUST_KEY = 'agile-trainer-cache-bust';

export const generateVersionId = (): string => {
  return Date.now().toString();
};

export const updateStorageVersion = (): string | null => {
  try {
    const version = generateVersionId();
    localStorage.setItem(STORAGE_VERSION_KEY, version);
    localStorage.setItem(GLOBAL_CACHE_BUST_KEY, version);
    console.log('[Storage] Updated storage version to:', version);
    return version;
  } catch (error) {
    console.error('[Storage] Failed to update storage version:', error);
    return null;
  }
};

export const getStorageVersion = (): string => {
  try {
    return localStorage.getItem(STORAGE_VERSION_KEY) || generateVersionId();
  } catch {
    return generateVersionId();
  }
};

export const getGlobalCacheBust = (): string => {
  try {
    return localStorage.getItem(GLOBAL_CACHE_BUST_KEY) || generateVersionId();
  } catch {
    return generateVersionId();
  }
};

export const setGlobalCacheBust = (value: string): string | null => {
  try {
    localStorage.setItem(GLOBAL_CACHE_BUST_KEY, value);
    console.log('[Storage] Updated global cache bust to:', value);
    return value;
  } catch (error) {
    console.error('[Storage] Failed to update global cache bust:', error);
    return null;
  }
};
