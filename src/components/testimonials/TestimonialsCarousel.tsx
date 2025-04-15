
import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import TestimonialCard from '@/components/testimonials/TestimonialCard';
import TestimonialsLoading from '@/components/testimonials/TestimonialsLoading';
import TestimonialsErrorState from '@/components/testimonials/TestimonialsErrorState';
import { useTestimonials } from '@/hooks/useTestimonials';
import { testimonials as localTestimonials } from '@/data/testimonials';

const TestimonialsCarousel = () => {
  // Limit to 10 testimonials
  const { testimonials: supabaseTestimonials, isLoading: isLoadingSupabase, error: supabaseError } = useTestimonials(10);
  const [allTestimonials, setAllTestimonials] = useState<any[]>(
    supabaseTestimonials.length > 0 ? 
      supabaseTestimonials : 
      [...localTestimonials].sort(() => Math.random() - 0.5).slice(0, 10)
  );
  
  useEffect(() => {
    if (supabaseTestimonials && supabaseTestimonials.length > 0) {
      setAllTestimonials(supabaseTestimonials);
    }
  }, [supabaseTestimonials]);
  
  if (isLoadingSupabase) {
    return <TestimonialsLoading />;
  }
  
  if (supabaseError) {
    return <TestimonialsErrorState 
      error={supabaseError} 
      fallbackTestimonials={[...localTestimonials].sort(() => Math.random() - 0.5).slice(0, 10)} 
    />;
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
    </div>
  );
};

export default TestimonialsCarousel;
