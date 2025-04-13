
import { useRef, useState, useEffect } from 'react';
import { Linkedin, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { initSociableKit, isLinkedInRecommendationsReady } from '@/utils/sociableKitLoader';
import { Button } from '@/components/ui/button';

interface LinkedInRecommendationsProps {
  isActive: boolean;
}

const LinkedInRecommendations = ({ isActive }: LinkedInRecommendationsProps) => {
  const [loading, setLoading] = useState(true);
  const [linkedInLoaded, setLinkedInLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const linkedInContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isActive) return;
    
    let cleanup: () => void;
    
    const loadWidget = () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Initializing LinkedIn recommendations widget with direct approach");
        
        // Initialize SociableKIT for LinkedIn recommendations
        cleanup = initSociableKit();
        
        // Check if LinkedIn widget is loaded every second for up to 15 seconds
        let attempts = 0;
        const maxAttempts = 15;
        
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
              setError("LinkedIn recommendations could not be loaded");
              toast({
                title: "LinkedIn Widget Error",
                description: "There was an issue loading LinkedIn recommendations. Please try again.",
                variant: "destructive"
              });
            }
          }
        }, 1000);
        
        return () => {
          clearInterval(checkInterval);
        };
      } catch (error) {
        console.error("Error loading LinkedIn recommendations:", error);
        setLoading(false);
        setError("Error initializing LinkedIn recommendations");
        toast({
          title: "LinkedIn Widget Error",
          description: "There was an issue loading LinkedIn recommendations.",
          variant: "destructive"
        });
        return () => {};
      }
    };
    
    const intervalCleanup = loadWidget();
    
    return () => {
      if (intervalCleanup) {
        intervalCleanup();
      }
      if (cleanup) {
        cleanup();
      }
    };
  }, [isActive, toast]);
  
  const reloadLinkedInRecommendations = () => {
    setLinkedInLoaded(false);
    setLoading(true);
    setError(null);
    
    // This timeout ensures the DOM elements are properly reset before attempting to reload
    setTimeout(() => {
      const cleanup = initSociableKit();
      
      // Check if LinkedIn widget is loaded every second for up to 15 seconds
      let attempts = 0;
      const maxAttempts = 15;
      
      const checkInterval = setInterval(() => {
        attempts++;
        const isReady = isLinkedInRecommendationsReady();
        
        if (isReady || attempts >= maxAttempts) {
          clearInterval(checkInterval);
          setLinkedInLoaded(isReady);
          setLoading(false);
          
          if (attempts >= maxAttempts && !isReady) {
            console.error("LinkedIn widget failed to load after maximum attempts");
            setError("LinkedIn recommendations could not be loaded");
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
        <div className="flex items-center justify-center gap-2 mb-6">
          <Loader2 className="h-5 w-5 animate-spin text-green-600" />
          <h3 className="text-xl font-semibold text-green-700">Loading LinkedIn Recommendations</h3>
        </div>
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
          <Alert variant="destructive" className="max-w-lg mx-auto bg-red-50 mb-4">
            <AlertDescription>
              {error || "LinkedIn recommendations are currently unavailable."}
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={reloadLinkedInRecommendations} 
            className="mt-2 bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Loading
          </Button>
        </div>
      )}
    </div>
  );
};

export default LinkedInRecommendations;
