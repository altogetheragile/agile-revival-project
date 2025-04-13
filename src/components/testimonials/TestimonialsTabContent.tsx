
import TestimonialsCarousel from './TestimonialsCarousel';
import LinkedInRecommendations from './LinkedInRecommendations';

interface TestimonialsTabContentProps {
  activeTab: string;
}

const TestimonialsTabContent = ({ activeTab }: TestimonialsTabContentProps) => {
  const isLinkedInTab = activeTab === 'linkedin';
  
  return isLinkedInTab ? (
    <LinkedInRecommendations isActive={isLinkedInTab} />
  ) : (
    <TestimonialsCarousel />
  );
};

export default TestimonialsTabContent;
