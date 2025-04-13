
import { useEffect, useState } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Linkedin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import TestimonialCard from '@/components/testimonials/TestimonialCard';
import { testimonials, Testimonial } from '@/data/testimonials';
import { initSociableKit, isLinkedInRecommendationsReady } from '@/utils/sociableKitLoader';

// Interface for LinkedIn recommendations
interface LinkedInRecommendation {
  id: string;
  name: string;
  title: string;
  company: string;
  content: string;
  profileUrl: string;
  imageUrl?: string;
}

const TestimonialsCarousel = () => {
  const [loading, setLoading] = useState(true);
  const [linkedInLoaded, setLinkedInLoaded] = useState(false);
  const [combinedTestimonials, setCombinedTestimonials] = useState<Testimonial[]>(testimonials);
  const { toast } = useToast();

  useEffect(() => {
    // Use a MutationObserver to detect when LinkedIn recommendations are added to the DOM
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const recommendationElements = document.querySelectorAll('.sk-ww-linkedin-recommendations-item');
          
          if (recommendationElements.length > 0) {
            // Convert LinkedIn recommendations to our Testimonial format
            const linkedInRecommendations: Testimonial[] = Array.from(recommendationElements).map((element, index) => {
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
            
            // Combine local and LinkedIn testimonials
            setCombinedTestimonials([...testimonials, ...linkedInRecommendations]);
            setLinkedInLoaded(true);
            setLoading(false);
            
            // Stop observing once we've processed the recommendations
            observer.disconnect();
          }
        }
      }
    });

    // Function to load LinkedIn recommendations
    const loadLinkedInRecommendations = () => {
      try {
        console.log("Initializing LinkedIn recommendations widget");
        // Create a hidden container for LinkedIn recommendations
        const hiddenContainer = document.createElement('div');
        hiddenContainer.id = 'linkedin-recommendations-container';
        hiddenContainer.style.position = 'absolute';
        hiddenContainer.style.left = '-9999px';
        hiddenContainer.style.visibility = 'hidden';
        hiddenContainer.className = 'sk-ww-linkedin-recommendations';
        hiddenContainer.setAttribute('data-embed-id', '166933');
        document.body.appendChild(hiddenContainer);
        
        // Initialize SociableKIT
        const cleanup = initSociableKit();
        
        // Start observing the hidden container
        observer.observe(hiddenContainer, { childList: true, subtree: true });
        
        // Set a timeout to stop waiting after 10 seconds
        const timeoutId = setTimeout(() => {
          if (!linkedInLoaded) {
            setLoading(false);
            observer.disconnect();
            console.log("LinkedIn recommendations timed out, showing local testimonials only");
          }
        }, 10000);
        
        // Return cleanup function
        return () => {
          clearTimeout(timeoutId);
          observer.disconnect();
          if (hiddenContainer && document.body.contains(hiddenContainer)) {
            document.body.removeChild(hiddenContainer);
          }
          cleanup();
        };
      } catch (error) {
        console.error("Error loading LinkedIn recommendations:", error);
        setLoading(false);
        return () => {};
      }
    };
    
    // Load LinkedIn recommendations when component mounts
    const cleanupFn = loadLinkedInRecommendations();
    
    // Cleanup when component unmounts
    return () => {
      cleanupFn();
    };
  }, []);

  // Function to retry loading LinkedIn recommendations
  const retryLoadLinkedInRecommendations = () => {
    setLoading(true);
    setCombinedTestimonials(testimonials);
    
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
            description: "Could not load LinkedIn recommendations. Showing local testimonials only.",
            variant: "destructive"
          });
        }
      }
    }, 1000);
  };

  return (
    <div className="px-4 md:px-10 py-6">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {combinedTestimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 pl-4 pr-4">
              <div className="h-full pb-6">
                <TestimonialCard testimonial={testimonial} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-8 gap-4">
          <CarouselPrevious className="relative static transform-none" />
          <CarouselNext className="relative static transform-none" />
        </div>
      </Carousel>
      
      {!linkedInLoaded && !loading && (
        <div className="mt-8 flex justify-center gap-2 items-center text-sm text-gray-500">
          <span>LinkedIn recommendations could not be loaded.</span>
          <button 
            onClick={retryLoadLinkedInRecommendations}
            className="inline-flex items-center text-green-600 hover:text-green-800" 
            aria-label="Retry loading LinkedIn recommendations"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Retry
          </button>
        </div>
      )}
      
      {loading && (
        <div className="mt-8 flex justify-center items-center gap-2 text-sm text-gray-500">
          <Linkedin className="h-4 w-4 animate-pulse" />
          <span>Loading LinkedIn recommendations...</span>
        </div>
      )}
    </div>
  );
};

export default TestimonialsCarousel;
