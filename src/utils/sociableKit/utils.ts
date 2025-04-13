
/**
 * Utility functions for SociableKit
 */

// Configuration constants
export const EMBED_ID = '166933';
export const MAX_ATTEMPTS = 5;
export const DEBUG = true;

// Function to log messages conditionally
export const log = (message: string, ...args: any[]) => {
  if (DEBUG) {
    console.log(`[SociableKit] ${message}`, ...args);
  }
};

// Global type definition for SociableKIT
declare global {
  interface Window {
    SK_LINKEDIN_RECOMMENDATIONS?: {
      reload: () => void;
    };
  }
}
