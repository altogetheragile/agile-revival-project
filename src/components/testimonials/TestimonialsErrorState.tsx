
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import TestimonialCard from '@/components/testimonials/TestimonialCard';
import { Testimonial } from '@/types/testimonials';

interface TestimonialsErrorStateProps {
  error: string;
  fallbackTestimonials: Testimonial[];
}

const TestimonialsErrorState: React.FC<TestimonialsErrorStateProps> = ({ 
  error, 
  fallbackTestimonials 
}) => {
  return (
    <div className="px-4 md:px-10 py-6">
      <Alert variant="destructive" className="bg-red-50 border-red-200 max-w-lg mx-auto">
        <AlertTitle>Error Loading Testimonials</AlertTitle>
        <AlertDescription>
          <p>{error}</p>
          <p className="text-sm mt-2">Showing fallback testimonials instead.</p>
        </AlertDescription>
      </Alert>
      
      <Carousel className="w-full mt-8">
        <CarouselContent>
          {fallbackTestimonials.map((testimonial) => (
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

export default TestimonialsErrorState;
