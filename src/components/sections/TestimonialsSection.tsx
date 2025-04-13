
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';

const TestimonialsSection = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SociableKIT script injection
    const script = document.createElement('script');
    script.src = "https://widgets.sociablekit.com/linkedin-recommendations/widget.js";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setLoading(false);
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Clean up the script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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
        ) : null}
        
        <div className="sk-ww-linkedin-recommendations" 
          data-embed-id="234906"
          data-theme="light_no_border">
        </div>
        
        <div className="mt-10 text-center">
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
