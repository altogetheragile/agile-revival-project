
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  
  // Maximum height for collapsed content (in pixels)
  const MAX_HEIGHT = 100;
  
  useEffect(() => {
    // Check if content exceeds the max height to determine if "Read More" should be shown
    if (contentRef.current && contentRef.current.scrollHeight > MAX_HEIGHT) {
      setShouldShowReadMore(true);
    }
  }, [testimonial.content]);
  
  return (
    <Card className="h-full flex flex-col p-6 bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start mb-4">
        <Quote className="text-green-600 shrink-0 mr-2" size={24} />
        <div className="flex-1 overflow-hidden">
          <p 
            ref={contentRef} 
            className={`text-gray-700 italic transition-all duration-300 ${!isExpanded && shouldShowReadMore ? 'line-clamp-4' : ''}`}
          >
            {testimonial.content}
          </p>
          
          {shouldShowReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <>Read less <ChevronUp size={16} /></>
              ) : (
                <>Read more <ChevronDown size={16} /></>
              )}
            </button>
          )}
        </div>
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
          <p className="text-sm text-gray-600">
            {testimonial.role}
            {testimonial.company ? `, ${testimonial.company}` : ''}
          </p>
        </div>
        
        {testimonial.linkedinUrl && (
          <a 
            href={testimonial.linkedinUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-2 p-2 text-blue-600 hover:text-blue-800 transition-colors"
            aria-label={`View ${testimonial.name}'s LinkedIn profile`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        )}
      </div>
    </Card>
  );
};

export default TestimonialCard;
