
/**
 * Creates an AbortController with timeout
 */
export const createTimeoutController = (timeoutMs: number = 10000): { 
  controller: AbortController, 
  timeoutId: NodeJS.Timeout 
} => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
};
