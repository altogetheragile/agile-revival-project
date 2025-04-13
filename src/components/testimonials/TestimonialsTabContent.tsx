
import { useEffect } from 'react';
import LinkedInRecommendations from './LinkedInRecommendations';
import TestimonialsCarousel from './TestimonialsCarousel';

interface TestimonialsTabContentProps {
  activeTab: string;
  loadLinkedInRecommendations: () => (() => void);
}

const TestimonialsTabContent = ({ activeTab, loadLinkedInRecommendations }: TestimonialsTabContentProps) => {
  // Initialize LinkedIn recommendations widget when the component mounts
  // or when the LinkedIn tab is selected
  useEffect(() => {
    let cleanup = () => {};
    
    if (activeTab === "linkedin" || activeTab === "all") {
      cleanup = loadLinkedInRecommendations();
    }
    
    // Clean up on component unmount or tab change
    return cleanup;
  }, [activeTab, loadLinkedInRecommendations]);

  // Tab content for "all" tab
  if (activeTab === "all") {
    return (
      <div className="mb-6">
        {/* Local testimonials */}
        <TestimonialsCarousel />
        
        {/* LinkedIn recommendations */}
        <div className="mt-12">
          <LinkedInRecommendations isActive={true} />
        </div>
      </div>
    );
  }
  
  // Tab content for "local" tab
  if (activeTab === "local") {
    return <TestimonialsCarousel />;
  }
  
  // Tab content for "linkedin" tab
  if (activeTab === "linkedin") {
    return <LinkedInRecommendations isActive={true} />;
  }
  
  return null;
};

export default TestimonialsTabContent;
