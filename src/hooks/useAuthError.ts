
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useAuthError() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleError = (error: any) => {
    console.error('Authentication error:', error);
    
    let message = error.message || "An error occurred during authentication";
    
    if (error.status === 504 || error.message?.includes('timeout')) {
      message = "The server is taking too long to respond. Please try again later.";
    } else if (error.message?.includes('Failed to fetch')) {
      message = "Network error. Please check your internet connection.";
    } else if (error.message?.includes('provider is not enabled')) {
      message = "Google authentication is not properly configured. Please check your Supabase settings.";
    } else if (error.message?.includes('popup blocked')) {
      message = "Pop-up blocked. Please allow pop-ups for this website and try again.";
    } else if (error.message?.includes('already registered')) {
      message = "Email already registered. Please use another email or try logging in.";
    } else if (error.message?.includes('invalid')) {
      message = "Invalid email or password. Please check your credentials and try again.";
    } else if (error.message?.includes('violates row-level security policy')) { 
      message = "Permission error. Your account may not have the right access level.";
    } else if (error.message?.includes('infinite recursion detected')) {
      message = "System error detected. Please contact support.";
    }
    
    setErrorMessage(message);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });

    return message;
  };

  return {
    errorMessage,
    setErrorMessage,
    handleError
  };
}
