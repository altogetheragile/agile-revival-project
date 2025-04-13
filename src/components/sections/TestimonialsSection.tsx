
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Linkedin, MessageSquare } from 'lucide-react';
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
import { initSociableKit, isLinkedInRecommendationsReady } from '@/utils/sociableKitLoader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TestimonialsSection = () => {
  const [loading, setLoading] = useState(true);
  const [linkedInLoaded, setLinkedInLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
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
  
  // Initialize LinkedIn recommendations widget when the component mounts
  // or when the LinkedIn tab is selected
  useEffect(() => {
    let cleanup = () => {};
    
    if (activeTab === "linkedin" || activeTab === "all") {
      cleanup = loadLinkedInRecommendations();
    }
    
    // Clean up on component unmount or tab change
    return cleanup;
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If switching to LinkedIn tab and it's not loaded, try loading it
    if ((value === "linkedin" || value === "all") && !linkedInLoaded) {
      loadLinkedInRecommendations();
    }
  };

  return (
    <section id="testimonials" className="section-container bg-gradient-to-br from-green-100 to-white py-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title text-green-800">What Our Clients Say</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
          Real testimonials from professionals who have experienced our leadership and agile coaching services.
        </p>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>All Testimonials</span>
              </TabsTrigger>
              <TabsTrigger value="local" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Client Stories</span>
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-2">
            <div className="mb-6">
              {loading && activeTab === "all" ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                </div>
              ) : (
                <>
                  {/* Local testimonials */}
                  <div className="px-4 md:px-10 py-6 mb-8">
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
                  
                  {/* LinkedIn recommendations */}
                  {!loading && (
                    <div className="mt-12 max-w-4xl mx-auto">
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
                  )}
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="local" className="mt-2">
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
          </TabsContent>
          
          <TabsContent value="linkedin" className="mt-2">
            {loading && activeTab === "linkedin" ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <div ref={linkedInContainerRef} className="sk-ww-linkedin-recommendations" data-embed-id="166933"></div>
                
                {!linkedInLoaded && (
                  <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
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
            )}
          </TabsContent>
        </Tabs>
        
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
