
import { toast } from 'sonner';

// Define standard error types for better categorization
export enum ErrorType {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  SERVER = 'server',
  NETWORK = 'network',
  NOT_FOUND = 'not_found',
  UNKNOWN = 'unknown',
}

// Define consistent error structure
export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  originalError?: any;
}

// Helper to categorize common error patterns
export const categorizeError = (error: any): AppError => {
  console.error('Raw error:', error);
  
  // Default error structure
  const appError: AppError = {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred',
    originalError: error
  };
  
  // Handle Supabase error formats
  if (error?.message) {
    appError.details = error.message;
    
    // Authentication errors
    if (
      error.message.includes('invalid login') || 
      error.message.includes('Invalid login') ||
      error.message.includes('Email not confirmed') ||
      error.message.includes('Invalid refresh token')
    ) {
      appError.type = ErrorType.AUTHENTICATION;
      appError.message = 'Authentication failed';
    }
    
    // Permission errors
    else if (
      error.message.includes('permission denied') ||
      error.message.includes('not authorized') ||
      error.message.includes('violates row-level security policy') ||
      error.message.includes('No rights to')
    ) {
      appError.type = ErrorType.AUTHORIZATION;
      appError.message = 'You do not have permission to perform this action';
    }
    
    // Validation errors
    else if (
      error.message.includes('violates check constraint') ||
      error.message.includes('duplicate key') ||
      error.message.includes('is not a valid')
    ) {
      appError.type = ErrorType.VALIDATION;
      appError.message = 'Invalid input data';
    }
    
    // Not found errors
    else if (
      error.message.includes('does not exist') ||
      error.message.includes('not found') ||
      error.message.includes('No record found')
    ) {
      appError.type = ErrorType.NOT_FOUND;
      appError.message = 'The requested resource was not found';
    }
    
    // Network errors
    else if (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('network request failed')
    ) {
      appError.type = ErrorType.NETWORK;
      appError.message = 'Network connection issue';
    }
    
    // RLS recursion errors
    else if (error.message.includes('infinite recursion detected')) {
      appError.type = ErrorType.SERVER;
      appError.message = 'Database permission configuration issue';
      appError.details = 'The system is experiencing a temporary permission issue.';
    }
    
    // Generic server error
    else if (error.status >= 500) {
      appError.type = ErrorType.SERVER;
      appError.message = 'Server error occurred';
    }
  }

  return appError;
};

// Display appropriate UI notification based on error type
export const handleError = (error: any, customMessage?: string): AppError => {
  const appError = categorizeError(error);
  
  // Show UI notification with appropriate message
  toast.error(customMessage || appError.message, {
    description: appError.details,
    duration: appError.type === ErrorType.NETWORK ? 5000 : 3000,
  });
  
  return appError;
};

// Helper function for specific error handling in auth contexts
export const handleAuthError = (error: any, customMessage?: string): AppError => {
  const appError = categorizeError(error);
  
  // Provide more specific messaging for auth errors
  if (appError.type === ErrorType.AUTHENTICATION) {
    if (error.message?.includes('Email not confirmed')) {
      appError.message = 'Please verify your email address';
      appError.details = 'Check your inbox for a confirmation email';
    } else if (error.message?.includes('Invalid login')) {
      appError.message = 'Incorrect email or password';
      appError.details = 'Please check your credentials and try again';
    } else if (error.message?.includes('already registered')) {
      appError.message = 'Account already exists';
      appError.details = 'Try logging in instead';
    }
  }
  
  // Show UI notification
  toast.error(customMessage || appError.message, {
    description: appError.details,
  });
  
  return appError;
};

// Export a simpler version for component use
export const showError = (message: string, details?: string) => {
  toast.error(message, {
    description: details,
  });
};

export const showSuccess = (message: string, details?: string) => {
  toast.success(message, {
    description: details,
  });
};
