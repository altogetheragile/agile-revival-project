
import { useState } from 'react';
import { ChevronRight, Linkedin, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLinkedInRecommendations } from '@/hooks/useLinkedInRecommendations';
import TestimonialsTabContent from '@/components/testimonials/TestimonialsTabContent';

const TestimonialsSection = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { loadLinkedInRecommendations } = useLinkedInRecommendations();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
          
          <TestimonialsTabContent 
            activeTab={activeTab} 
            loadLinkedInRecommendations={loadLinkedInRecommendations} 
          />
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
