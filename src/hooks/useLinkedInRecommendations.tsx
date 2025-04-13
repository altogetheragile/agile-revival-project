
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
      const cleanupFn = initSociableKit();
      
      // Check if LinkedIn widget is loaded every second for up to 10 seconds
      let attempts = 0;
      const maxAttempts = 10;
      
      const checkInterval = setInterval(() => {
        attempts++;
        const isReady = isLinkedInRecommendationsReady();
        console.log(`Checking if widget is ready (attempt ${attempts}/${maxAttempts}): ${isReady ? 'Yes' : 'No'}`);
        
        if (isReady || attempts >= maxAttempts) {
          clearInterval(checkInterval);
          setLinkedInLoaded(isReady);
          setLoading(false);
          
          if (attempts >= maxAttempts && !isReady) {
            console.error("LinkedIn widget failed to load after maximum attempts");
            throw new Error("LinkedIn recommendations widget failed to load");
          }
        }
      }, 1000);
      
      return () => {
        clearInterval(checkInterval);
        if (cleanupFn) cleanupFn();
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
