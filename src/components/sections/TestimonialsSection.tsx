
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import TestimonialCard from '@/components/testimonials/TestimonialCard';
import { testimonials } from '@/data/testimonials';
import { useToast } from '@/components/ui/use-toast';

const TestimonialsSection = () => {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate loading from a spreadsheet with a short delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Function that could be used to load data from a spreadsheet API
  // const loadTestimonialsFromSpreadsheet = async () => {
  //   try {
  //     setLoading(true);
  //     // Replace with actual API call to fetch spreadsheet data
  //     // const response = await fetch('your-spreadsheet-api-url');
  //     // const data = await response.json();
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error loading testimonials:', error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to load testimonials. Please try again later.",
  //       variant: "destructive"
  //     });
  //     setLoading(false);
  //   }
  // };

  return (
    <section id="testimonials" className="section-container bg-gradient-to-br from-green-100 to-white py-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title text-green-800">What Our Clients Say</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
          Real testimonials from professionals who have experienced our leadership and agile coaching services.
        </p>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : (
          <div className="px-4 md:px-10 py-6">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial) => (
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
        )}
        
        <div className="mt-8 text-center">
          <a 
            href="https://www.linkedin.com/in/alundavies-baker/details/recommendations/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            View More Recommendations on LinkedIn
            <ChevronRight className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
