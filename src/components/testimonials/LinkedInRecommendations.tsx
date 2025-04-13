
import { useRef, useState, useEffect } from 'react';
import { Linkedin, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { initSociableKit, createWidgetContainer, isWidgetLoaded } from '@/utils/sociableKitLoader';

interface LinkedInRecommendationsProps {
  isActive: boolean;
}

const LinkedInRecommendations = ({ isActive }: LinkedInRecommendationsProps) => {
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const checkerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  
  // Function to check if widget is loaded
  const checkWidgetLoaded = () => {
    if (!mountedRef.current) return;
    
    const isLoaded = isWidgetLoaded();
    if (isLoaded) {
      setLoaded(true);
      setLoading(false);
      setError(null);
      if (checkerRef.current) {
        clearInterval(checkerRef.current);
        checkerRef.current = null;
      }
    }
    return isLoaded;
  };
  
  // Setup polling for widget load
  const setupLoadChecker = () => {
    // Clear any existing interval
    if (checkerRef.current) {
      clearInterval(checkerRef.current);
    }
    
    // Check immediately
    if (checkWidgetLoaded()) return;
    
    // Set up interval to check every 1.5 seconds
    let attempts = 0;
    const maxAttempts = 15; // 22.5 seconds total
    
    checkerRef.current = window.setInterval(() => {
      attempts++;
      
      if (checkWidgetLoaded() || attempts >= maxAttempts) {
        // If reached max attempts and still not loaded
        if (attempts >= maxAttempts && !isWidgetLoaded() && mountedRef.current) {
          console.error("LinkedIn widget failed to load after maximum attempts");
          setError("LinkedIn recommendations could not be loaded");
          setLoading(false);
          toast({
            title: "LinkedIn Widget Error",
            description: "There was an issue loading LinkedIn recommendations. Please try again later.",
            variant: "destructive"
          });
        }
        
        // Clear the interval either way
        if (checkerRef.current) {
          clearInterval(checkerRef.current);
          checkerRef.current = null;
        }
      }
    }, 1500);
  };
  
  // Load the LinkedIn recommendations
  const loadRecommendations = async () => {
    if (!isActive || !containerRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      setLoaded(false);
      
      // Clear any previous container content
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        
        // Create widget container inside our ref container
        createWidgetContainer(containerRef.current);
      }
      
      // Initialize SociableKit
      await initSociableKit();
      
      // Setup polling to check if widget loaded
      setupLoadChecker();
      
    } catch (error) {
      console.error("Error loading LinkedIn recommendations:", error);
      setLoading(false);
      setError("Error initializing LinkedIn recommendations");
      toast({
        title: "LinkedIn Widget Error",
        description: "There was an issue loading LinkedIn recommendations.",
        variant: "destructive"
      });
    }
  };
  
  // Initial load
  useEffect(() => {
    if (isActive) {
      loadRecommendations();
    }
    
    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (checkerRef.current) {
        clearInterval(checkerRef.current);
        checkerRef.current = null;
      }
    };
  }, [isActive]);
  
  // Handle manual reload
  const handleRetryLoad = () => {
    loadRecommendations();
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
      
      <div ref={containerRef} className="linkedin-container min-h-[200px]"></div>
      
      {!loaded && !loading && error && (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <Alert variant="destructive" className="max-w-lg mx-auto bg-red-50 mb-4">
            <AlertDescription>
              {error || "LinkedIn recommendations are currently unavailable."}
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleRetryLoad} 
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
