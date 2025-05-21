
// Export all utilities from the Supabase folder
export * from './controllers';
// Use explicit "export type" for type exports
export { executeQuery } from './query';
export type { QueryResult } from './query';
export type { QueryOptions, ConnectionCheckResult, ConnectionError, ConnectionErrorType } from './types';
// Export non-type members normally
export * from './connection';

// Export a convenience function for health checks
export { checkDatabaseHealth as checkConnection } from './connection';

// Add specific exports for role checking
export { checkUserRole, isUserAdmin, checkUserRoleById } from './controllers';
