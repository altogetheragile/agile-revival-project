
import { MessageSquare } from 'lucide-react';
import TestimonialsCarousel from '@/components/testimonials/TestimonialsCarousel';

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="section-container bg-gradient-to-br from-green-100 to-white py-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title text-green-800">What Our Clients Say</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
          Real testimonials from professionals who have experienced our leadership and agile coaching services.
        </p>
        
        <TestimonialsCarousel />
      </div>
    </section>
  );
};

export default TestimonialsSection;
