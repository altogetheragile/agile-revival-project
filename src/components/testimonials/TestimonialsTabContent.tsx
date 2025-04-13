
import TestimonialsCarousel from './TestimonialsCarousel';

interface TestimonialsTabContentProps {
  activeTab: string;
}

const TestimonialsTabContent = ({ activeTab }: TestimonialsTabContentProps) => {
  return <TestimonialsCarousel />;
};

export default TestimonialsTabContent;
