
import { useState, useEffect, useRef } from 'react';
import { Loader2, RefreshCw, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Testimonial } from '@/types/testimonials';
import { initSociableKit } from '@/utils/sociableKitLoader';

interface LinkedInLoaderProps {
  onTestimonialsLoaded: (testimonials: Testimonial[]) => void;
  autoLoad?: boolean;
}

const LinkedInLoader = ({ onTestimonialsLoaded, autoLoad = true }: LinkedInLoaderProps) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const loadAttemptRef = useRef(0);
  const cleanupFnRef = useRef<(() => void) | null>(null);

  const loadLinkedInTestimonials = () => {
    setLoading(true);
    setErrorMessage(null);
    loadAttemptRef.current += 1;
    const currentAttempt = loadAttemptRef.current;
    
    console.log(`Loading LinkedIn testimonials (attempt ${currentAttempt})...`);
    
    const hiddenContainer = document.createElement('div');
    hiddenContainer.id = 'linkedin-hidden-container';
    hiddenContainer.className = 'sk-ww-linkedin-recommendations';
    hiddenContainer.setAttribute('data-embed-id', '166933');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.width = '800px';
    hiddenContainer.style.height = '500px';
    hiddenContainer.style.overflow = 'hidden';
    
    const existingContainer = document.getElementById('linkedin-hidden-container');
    if (existingContainer && existingContainer.parentNode) {
      existingContainer.parentNode.removeChild(existingContainer);
    }
    
    document.body.appendChild(hiddenContainer);
    
    if (cleanupFnRef.current) {
      cleanupFnRef.current();
    }
    cleanupFnRef.current = initSociableKit();
    
    const timeoutDuration = 20000; 
    const timeout = setTimeout(() => {
      if (currentAttempt !== loadAttemptRef.current) return;
      
      console.log("LinkedIn recommendations loading timed out");
      setLoading(false);
      setErrorMessage("LinkedIn recommendations could not be loaded. Please try again.");
      
      toast({
        title: "LinkedIn Recommendations",
        description: "Could not load LinkedIn recommendations. Local testimonials will be shown.",
        variant: "destructive",
      });
      
      if (hiddenContainer.parentNode) {
        hiddenContainer.parentNode.removeChild(hiddenContainer);
      }
      if (cleanupFnRef.current) {
        cleanupFnRef.current();
      }
    }, timeoutDuration);
    
    const observer = new MutationObserver((mutations) => {
      if (currentAttempt !== loadAttemptRef.current) return;
      
      const recommendations = document.querySelectorAll('.sk-ww-linkedin-recommendations-item');
      
      if (recommendations && recommendations.length > 0) {
        console.log(`Found ${recommendations.length} LinkedIn recommendations`);
        clearTimeout(timeout);
        
        try {
          const linkedInTestimonials: Testimonial[] = Array.from(recommendations).map((element, index) => {
            const nameElement = element.querySelector('.sk-ww-linkedin-recommendations-reviewer-name');
            const titleElement = element.querySelector('.sk-ww-linkedin-recommendations-reviewer-title');
            const textElement = element.querySelector('.sk-ww-linkedin-recommendations-text');
            const imageElement = element.querySelector('.sk-ww-linkedin-recommendations-reviewer-image') as HTMLImageElement;
            const profileElement = element.querySelector('a.sk-ww-linkedin-recommendations-reviewer-name') as HTMLAnchorElement;
            
            return {
              id: `linkedin-${index}`,
              name: nameElement?.textContent?.trim() || 'LinkedIn Connection',
              role: titleElement?.textContent?.trim().split(' at ')[0] || 'Professional',
              company: titleElement?.textContent?.trim().split(' at ')[1] || '',
              content: textElement?.textContent?.trim() || 'Recommendation from LinkedIn',
              linkedinUrl: profileElement?.href || undefined,
              imageUrl: imageElement?.src || undefined,
              isLinkedIn: true
            };
          });
          
          if (linkedInTestimonials.length > 0) {
            onTestimonialsLoaded(linkedInTestimonials);
            setErrorMessage(null);
            
            toast({
              title: "LinkedIn Recommendations",
              description: `Successfully loaded ${linkedInTestimonials.length} recommendations from LinkedIn.`,
              variant: "default",
            });
          } else {
            setErrorMessage("Found LinkedIn widget but no recommendations were available.");
          }
        } catch (err) {
          console.error("Error processing LinkedIn recommendations:", err);
          setErrorMessage("Error processing LinkedIn recommendations.");
        }
        
        observer.disconnect();
        setLoading(false);
        
        if (hiddenContainer.parentNode) {
          hiddenContainer.parentNode.removeChild(hiddenContainer);
        }
        if (cleanupFnRef.current) {
          cleanupFnRef.current();
        }
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
      
      if (hiddenContainer.parentNode) {
        hiddenContainer.parentNode.removeChild(hiddenContainer);
      }
      
      if (cleanupFnRef.current) {
        cleanupFnRef.current();
      }
    };
  };
  
  useEffect(() => {
    if (autoLoad) {
      const cleanup = loadLinkedInTestimonials();
      
      return () => {
        if (cleanup) {
          cleanup();
        }
        if (cleanupFnRef.current) {
          cleanupFnRef.current();
          cleanupFnRef.current = null;
        }
      };
    }
  }, [autoLoad]);
  
  return (
    <>
      {loading && (
        <div className="mt-8 flex justify-center items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading LinkedIn recommendations...</span>
        </div>
      )}
      
      {!loading && errorMessage && (
        <div className="mt-8 w-full max-w-lg mx-auto">
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertTitle className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn Recommendations Issue
            </AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <span>{errorMessage}</span>
              <button 
                onClick={loadLinkedInTestimonials}
                className="inline-flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700" 
                disabled={loading}
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Retry
              </button>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {!loading && !errorMessage && (
        <div className="mt-8 flex justify-center gap-2 items-center">
          <button 
            onClick={loadLinkedInTestimonials}
            className="inline-flex items-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded" 
            disabled={loading}
          >
            <Linkedin className="h-4 w-4 mr-2" />
            Load LinkedIn Recommendations
          </button>
        </div>
      )}
    </>
  );
};

export default LinkedInLoader;
