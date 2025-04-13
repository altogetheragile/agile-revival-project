
import { useState } from 'react';
import { MessageSquare, Linkedin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TestimonialsCarousel from '@/components/testimonials/TestimonialsCarousel';
import LinkedInRecommendations from '@/components/testimonials/LinkedInRecommendations';

const TestimonialsSection = () => {
  const [activeTab, setActiveTab] = useState('carousel');
  
  return (
    <section id="testimonials" className="section-container bg-gradient-to-br from-green-100 to-white py-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title text-green-800">What Our Clients Say</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
          Real testimonials from professionals who have experienced our leadership and agile coaching services.
        </p>
        
        <Tabs defaultValue="carousel" onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="carousel" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Testimonials</span>
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="carousel">
            <TestimonialsCarousel />
          </TabsContent>
          
          <TabsContent value="linkedin">
            <LinkedInRecommendations isActive={activeTab === 'linkedin'} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default TestimonialsSection;
