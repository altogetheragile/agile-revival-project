
/**
 * Convert date values to ISO strings for Supabase database operations
 * Handles both string and Date objects, returning strings or null
 */
export const formatDateForDb = (date: string | Date | null | undefined): string | null => {
  if (!date) return null;
  return date instanceof Date ? date.toISOString() : date;
};

/**
 * Normalize course data for database operations
 * Converts date fields to proper format and ensures consistent data types
 */
export const normalizeCourseDates = <T extends { startDate?: string | Date | null, endDate?: string | Date | null }>(
  data: T
): T => {
  return {
    ...data,
    startDate: formatDateForDb(data.startDate),
    endDate: formatDateForDb(data.endDate)
  };
};

/**
 * Process learning outcomes to ensure they are always in array format
 */
export const normalizeLearningOutcomes = (
  learningOutcomes: string | string[] | undefined
): string[] => {
  if (!learningOutcomes) return [];
  return Array.isArray(learningOutcomes) ? learningOutcomes : 
    typeof learningOutcomes === 'string' ? 
      learningOutcomes.split('\n').filter(line => line.trim().length > 0) : 
      [];
};
