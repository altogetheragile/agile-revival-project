
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Working with Altogether Agile transformed how our teams collaborate. Our delivery cadence improved by 40% within just three months.",
      author: "Sarah Johnson",
      position: "CTO, TechNova Solutions",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
    },
    {
      quote: "Their practical approach to agile coaching helped us navigate a complex digital transformation. I particularly appreciated how they customized their methods to fit our unique organizational culture.",
      author: "Michael Reeves",
      position: "VP of Product, Global Financial",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
    },
    {
      quote: "The leadership coaching we received has been invaluable. Our managers now truly understand how to support agile teams instead of reverting to command-and-control approaches.",
      author: "Elena Rodriguez",
      position: "Director of Operations, HealthPlus",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="section-container bg-gradient-to-br from-agile-purple-light to-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title text-agile-purple-dark">What Our Clients Say</h2>
        <div className="relative mt-12 pb-12">
          <div className="flex justify-center">
            <div className="relative w-full">
              <div className="absolute z-10 top-0 left-0 transform -translate-x-2 -translate-y-8">
                <Quote className="w-20 h-20 text-agile-purple opacity-20" />
              </div>
              {/* Testimonial Card */}
              <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 relative z-20">
                <p className="text-xl md:text-2xl text-gray-700 mb-8 italic">
                  "{testimonials[currentIndex].quote}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].author}
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold">{testimonials[currentIndex].author}</h4>
                    <p className="text-gray-600">{testimonials[currentIndex].position}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 gap-3">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-agile-purple-light transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="text-agile-purple" size={24} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentIndex === index ? 'bg-agile-purple' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-agile-purple-light transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="text-agile-purple" size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
