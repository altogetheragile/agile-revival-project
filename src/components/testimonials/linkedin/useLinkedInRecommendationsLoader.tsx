
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initSociableKit } from '@/utils/sociableKitLoader';
import { Testimonial } from '@/types/testimonials';

export const useLinkedInRecommendationsLoader = (onTestimonialsLoaded: (testimonials: Testimonial[]) => void) => {
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
    return () => {
      if (cleanupFnRef.current) {
        cleanupFnRef.current();
        cleanupFnRef.current = null;
      }
    };
  }, []);
  
  return {
    loading,
    errorMessage,
    loadLinkedInTestimonials
  };
};
