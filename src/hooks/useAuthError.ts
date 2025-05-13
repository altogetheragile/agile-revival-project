
import { useState } from 'react';
import { toast } from 'sonner';

export function useAuthError() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleError = (error: any) => {
    console.error('Authentication error:', error);
    
    let message = error.message || "An error occurred during authentication";
    
    // Format user-friendly error messages
    if (error.status === 504 || error.message?.includes('timeout')) {
      message = "The server is taking too long to respond. Please try again later.";
    } else if (error.message?.includes('Failed to fetch')) {
      message = "Network error. Please check your internet connection.";
    } else if (error.message?.includes('provider is not enabled')) {
      message = "Google authentication is not properly configured.";
    } else if (error.message?.includes('popup blocked')) {
      message = "Pop-up blocked. Please allow pop-ups for this website and try again.";
    } else if (error.message?.includes('already registered')) {
      message = "Email already registered. Please use another email or try logging in.";
    } else if (error.message?.includes('invalid login credentials')) {
      message = "Invalid email or password. Please check your credentials and try again.";
    } else if (error.message?.includes('violates row-level security policy')) { 
      message = "Permission error. You may not have the right access level.";
    } else if (error.message?.includes('Email link is invalid or has expired')) {
      message = "The password reset link is invalid or has expired. Please request a new one.";
    }
    
    setErrorMessage(message);
    toast.error("Authentication Error", {
      description: message,
    });

    return message;
  };

  return {
    errorMessage,
    setErrorMessage,
    handleError
  };
}
