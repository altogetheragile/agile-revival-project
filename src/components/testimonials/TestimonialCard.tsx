
import React from 'react';
import { Card } from '@/components/ui/card';
import { Quote, Linkedin } from 'lucide-react';
import { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <Card className="h-full flex flex-col p-6 bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start mb-4">
        <Quote className="text-green-600 shrink-0 mr-2" size={24} />
        <p className="text-gray-700 italic">{testimonial.content}</p>
      </div>
      
      <div className="mt-auto pt-4 flex items-center">
        {testimonial.imageUrl && (
          <div className="mr-4 w-12 h-12 rounded-full overflow-hidden border border-gray-200">
            <img 
              src={testimonial.imageUrl} 
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{testimonial.name}</p>
          <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
        </div>
        
        {testimonial.linkedinUrl && (
          <a 
            href={testimonial.linkedinUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-2 p-2 text-blue-600 hover:text-blue-800 transition-colors"
            aria-label={`View ${testimonial.name}'s LinkedIn profile`}
          >
            <Linkedin size={18} />
          </a>
        )}
      </div>
    </Card>
  );
};

export default TestimonialCard;
