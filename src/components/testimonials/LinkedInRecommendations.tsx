
import { useRef, useState } from 'react';
import { Linkedin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { initSociableKit, isLinkedInRecommendationsReady } from '@/utils/sociableKitLoader';

interface LinkedInRecommendationsProps {
  isActive: boolean;
}

const LinkedInRecommendations = ({ isActive }: LinkedInRecommendationsProps) => {
  const [loading, setLoading] = useState(true);
  const [linkedInLoaded, setLinkedInLoaded] = useState(false);
  const linkedInContainerRef = useRef<HTMLDivElement>(null);
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

  if (loading && isActive) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
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
      
      {!linkedInLoaded && (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">LinkedIn recommendations are currently unavailable.</p>
          <button 
            onClick={loadLinkedInRecommendations} 
            className="mt-2 text-sm text-green-600 hover:text-green-800"
          >
            Retry Loading
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkedInRecommendations;
