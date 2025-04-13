
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { initSociableKit, isLinkedInRecommendationsReady } from '@/utils/sociableKitLoader';

export const useLinkedInRecommendations = () => {
  const [loading, setLoading] = useState(true);
  const [linkedInLoaded, setLinkedInLoaded] = useState(false);
  const { toast } = useToast();
  
  const loadLinkedInRecommendations = () => {
    try {
      setLoading(true);
      console.log("Initializing LinkedIn recommendations widget");
      
      // Initialize SociableKIT for LinkedIn recommendations
      const cleanup = initSociableKit();
      
      // Check if LinkedIn widget is loaded every second for up to 10 seconds
      let attempts = 0;
      const maxAttempts = 10;
      let checkInterval: number | null = null;
      
      checkInterval = window.setInterval(() => {
        attempts++;
        const isReady = isLinkedInRecommendationsReady();
        console.log(`Checking if widget is ready (attempt ${attempts}/${maxAttempts}): ${isReady ? 'Yes' : 'No'}`);
        
        if (isReady || attempts >= maxAttempts) {
          if (checkInterval !== null) {
            window.clearInterval(checkInterval);
          }
          setLinkedInLoaded(isReady);
          setLoading(false);
          
          if (attempts >= maxAttempts && !isReady) {
            console.error("LinkedIn widget failed to load after maximum attempts");
            toast({
              title: "LinkedIn Widget Error",
              description: "There was an issue loading LinkedIn recommendations. Local testimonials are still available.",
              variant: "destructive"
            });
          }
        }
      }, 1000);
      
      // Return a synchronous cleanup function
      return () => {
        if (checkInterval !== null) {
          window.clearInterval(checkInterval);
        }
        cleanup(); // Call the cleanup function from initSociableKit
      };
    } catch (error) {
      console.error("Error loading LinkedIn recommendations:", error);
      setLoading(false);
      toast({
        title: "LinkedIn Widget Error",
        description: "There was an issue loading LinkedIn recommendations. Local testimonials are still available.",
        variant: "destructive"
      });
      return () => {}; // Return empty cleanup function in case of error
    }
  };
  
  return {
    loading,
    linkedInLoaded,
    loadLinkedInRecommendations
  };
};
