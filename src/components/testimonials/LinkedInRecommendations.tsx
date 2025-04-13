
import { useRef, useState, useEffect } from 'react';
import { Linkedin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { initSociableKit, isLinkedInRecommendationsReady } from '@/utils/sociableKitLoader';

interface LinkedInRecommendationsProps {
  isActive: boolean;
}

const LinkedInRecommendations = ({ isActive }: LinkedInRecommendationsProps) => {
  const [loading, setLoading] = useState(true);
  const [linkedInLoaded, setLinkedInLoaded] = useState(false);
  const linkedInContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isActive) return;
    
    let cleanup: () => void = () => {};
    
    const loadWidget = () => {
      try {
        setLoading(true);
        console.log("Initializing LinkedIn recommendations widget");
        
        // Initialize SociableKIT for LinkedIn recommendations
        cleanup = initSociableKit();
        
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
        };
      } catch (error) {
        console.error("Error loading LinkedIn recommendations:", error);
        setLoading(false);
        toast({
          title: "LinkedIn Widget Error",
          description: "There was an issue loading LinkedIn recommendations. Local testimonials are still available.",
          variant: "destructive"
        });
      }
    };
    
    const widgetLoader = loadWidget();
    
    return () => {
      if (widgetLoader && typeof widgetLoader === 'function') {
        widgetLoader();
      }
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [isActive, toast]);
  
  const loadLinkedInRecommendations = () => {
    setLinkedInLoaded(false);
    setLoading(true);
    
    // This timeout ensures the DOM elements are properly reset before attempting to reload
    setTimeout(() => {
      const cleanup = initSociableKit();
      
      // Check if LinkedIn widget is loaded every second for up to 10 seconds
      let attempts = 0;
      const maxAttempts = 10;
      
      const checkInterval = setInterval(() => {
        attempts++;
        const isReady = isLinkedInRecommendationsReady();
        
        if (isReady || attempts >= maxAttempts) {
          clearInterval(checkInterval);
          setLinkedInLoaded(isReady);
          setLoading(false);
          
          if (attempts >= maxAttempts && !isReady) {
            console.error("LinkedIn widget failed to load after maximum attempts");
            toast({
              title: "LinkedIn Widget Error",
              description: "There was an issue loading LinkedIn recommendations. Please try again later.",
              variant: "destructive"
            });
          }
        }
      }, 1000);
    }, 500);
  };

  if (loading && isActive) {
    return (
      <div className="flex flex-col gap-4 w-full py-16">
        <Skeleton className="h-10 w-40 mx-auto mb-6" />
        <Skeleton className="h-24 w-full max-w-2xl mx-auto rounded-lg" />
        <Skeleton className="h-24 w-full max-w-2xl mx-auto rounded-lg" />
        <Skeleton className="h-24 w-full max-w-2xl mx-auto rounded-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-green-700 flex items-center justify-center gap-2">
          <Linkedin className="h-5 w-5" />
          LinkedIn Recommendations
        </h3>
      </div>
      
      <div ref={linkedInContainerRef} className="sk-ww-linkedin-recommendations" data-embed-id="166933"></div>
      
      {!linkedInLoaded && !loading && (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">LinkedIn recommendations are currently unavailable.</p>
          <button 
            onClick={loadLinkedInRecommendations} 
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkedInRecommendations;
