
import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Linkedin } from 'lucide-react';
import TestimonialCard from '@/components/testimonials/TestimonialCard';
import LinkedInLoader from '@/components/testimonials/LinkedInLoader';
import TestimonialsLoading from '@/components/testimonials/TestimonialsLoading';
import TestimonialsErrorState from '@/components/testimonials/TestimonialsErrorState';
import { useTestimonials } from '@/hooks/useTestimonials';
import { Testimonial } from '@/types/testimonials';
import { testimonials as localTestimonials } from '@/data/testimonials';

const TestimonialsCarousel = () => {
  const { testimonials: supabaseTestimonials, isLoading: isLoadingSupabase, error: supabaseError } = useTestimonials();
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(supabaseTestimonials.length > 0 ? supabaseTestimonials : localTestimonials);
  
  useEffect(() => {
    if (supabaseTestimonials && supabaseTestimonials.length > 0) {
      setAllTestimonials(supabaseTestimonials);
    }
  }, [supabaseTestimonials]);

  const handleLinkedInTestimonialsLoaded = (linkedInTestimonials: Testimonial[]) => {
    setAllTestimonials(prevTestimonials => [...prevTestimonials, ...linkedInTestimonials]);
  };
  
  if (isLoadingSupabase) {
    return <TestimonialsLoading />;
  }
  
  if (supabaseError) {
    return <TestimonialsErrorState error={supabaseError} fallbackTestimonials={localTestimonials} />;
  }
  
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
      
      {allTestimonials.length === supabaseTestimonials.length && (
        <LinkedInLoader 
          onTestimonialsLoaded={handleLinkedInTestimonialsLoaded} 
          autoLoad={true}
        />
      )}
    </div>
  );
};

export default TestimonialsCarousel;
