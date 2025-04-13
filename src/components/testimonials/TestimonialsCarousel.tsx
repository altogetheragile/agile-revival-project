
import { useState, useEffect } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { RefreshCw, Linkedin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import TestimonialCard from '@/components/testimonials/TestimonialCard';
import { testimonials, Testimonial } from '@/data/testimonials';
import { initSociableKit } from '@/utils/sociableKitLoader';

const TestimonialsCarousel = () => {
  const [loading, setLoading] = useState(false);
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(testimonials);
  const { toast } = useToast();

  const loadLinkedInTestimonials = () => {
    setLoading(true);
    
    // Create container for LinkedIn recommendations if it doesn't exist
    const containerId = 'linkedin-recommendations-container';
    let container = document.getElementById(containerId);
    
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.className = 'sk-ww-linkedin-recommendations';
      container.setAttribute('data-embed-id', '166933');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.height = '500px';
      container.style.width = '500px';
      container.style.overflow = 'hidden';
      document.body.appendChild(container);
    }
    
    // Initialize SociableKit
    console.log('Initializing LinkedIn recommendations...');
    const cleanup = initSociableKit();
    
    // Set up mutation observer to detect when recommendations are added
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const recommendations = container?.querySelectorAll('.sk-ww-linkedin-recommendations-item');
          
          if (recommendations && recommendations.length > 0) {
            console.log(`Found ${recommendations.length} LinkedIn recommendations`);
            
            try {
              // Convert LinkedIn recommendations to our Testimonial format
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
              
              // Combine with local testimonials
              setAllTestimonials([...testimonials, ...linkedInTestimonials]);
              
              toast({
                title: "LinkedIn Recommendations",
                description: `Successfully loaded ${linkedInTestimonials.length} recommendations from LinkedIn.`,
                variant: "default",
              });
            } catch (err) {
              console.error("Error processing LinkedIn recommendations:", err);
            }
            
            observer.disconnect();
            setLoading(false);
            return;
          }
        }
      }
    });
    
    // Start observing if container exists
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }
    
    // Set timeout to prevent indefinite loading
    const timeout = setTimeout(() => {
      observer.disconnect();
      setLoading(false);
      
      toast({
        title: "LinkedIn Recommendations",
        description: "Could not load LinkedIn recommendations. Showing local testimonials only.",
        variant: "destructive",
      });
      
      console.log("LinkedIn recommendations loading timed out");
    }, 10000);
    
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
      cleanup();
    };
  };
  
  // Load LinkedIn testimonials on component mount
  useEffect(() => {
    loadLinkedInTestimonials();
  }, []);
  
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
          {allTestimonials.map((testimonial) => (
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
      
      {loading && (
        <div className="mt-8 flex justify-center items-center gap-2 text-sm text-gray-500">
          <Linkedin className="h-4 w-4 animate-pulse" />
          <span>Loading LinkedIn recommendations...</span>
        </div>
      )}
      
      {!loading && allTestimonials.length === testimonials.length && (
        <div className="mt-8 flex justify-center gap-2 items-center text-sm text-gray-500">
          <span>LinkedIn recommendations could not be loaded.</span>
          <button 
            onClick={loadLinkedInTestimonials}
            className="inline-flex items-center text-green-600 hover:text-green-800" 
            aria-label="Retry loading LinkedIn recommendations"
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonialsCarousel;
