
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { initSociableKit, isWidgetLoaded } from '@/utils/sociableKitLoader';

export const useLinkedInRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [linkedInLoaded, setLinkedInLoaded] = useState(false);
  const { toast } = useToast();
  const checkerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  
  const loadLinkedInRecommendations = async () => {
    try {
      setLoading(true);
      console.log("Loading LinkedIn recommendations with new approach");
      
      // Initialize SociableKIT
      await initSociableKit();
      
      // Clear any existing interval
      if (checkerRef.current) {
        clearInterval(checkerRef.current);
      }
      
      // Check immediately
      if (isWidgetLoaded()) {
        setLinkedInLoaded(true);
        setLoading(false);
        return;
      }
      
      // Set up interval to check every second for up to 20 seconds
      let attempts = 0;
      const maxAttempts = 20;
      
      checkerRef.current = window.setInterval(() => {
        attempts++;
        const isReady = isWidgetLoaded();
        console.log(`Checking if LinkedIn widget is ready (attempt ${attempts}/${maxAttempts}): ${isReady ? 'Yes' : 'No'}`);
        
        if (isReady || attempts >= maxAttempts) {
          clearInterval(checkerRef.current!);
          checkerRef.current = null;
          
          if (mountedRef.current) {
            setLinkedInLoaded(isReady);
            setLoading(false);
            
            if (attempts >= maxAttempts && !isReady) {
              console.error("LinkedIn widget failed to load after maximum attempts");
              toast({
                title: "LinkedIn Widget Error",
                description: "There was an issue loading LinkedIn recommendations. Local testimonials are still available.",
                variant: "destructive"
              });
            } else if (isReady) {
              toast({
                title: "LinkedIn Recommendations",
                description: "LinkedIn recommendations loaded successfully.",
                variant: "default"
              });
            }
          }
        }
      }, 1000);
      
    } catch (error) {
      console.error("Error loading LinkedIn recommendations:", error);
      setLoading(false);
      toast({
        title: "LinkedIn Widget Error",
        description: "There was an issue loading LinkedIn recommendations. Local testimonials are still available.",
        variant: "destructive"
      });
    }
    
    // Return cleanup function
    return () => {
      mountedRef.current = false;
      if (checkerRef.current) {
        clearInterval(checkerRef.current);
        checkerRef.current = null;
      }
    };
  };
  
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (checkerRef.current) {
        clearInterval(checkerRef.current);
      }
    };
  }, []);
  
  return {
    loading,
    linkedInLoaded,
    loadLinkedInRecommendations
  };
};
