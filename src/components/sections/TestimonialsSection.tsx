
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Justin is an incredibly skilled Agile coach who played a pivotal role in our organization's transformation. His guidance helped us overcome significant delivery challenges while coaching our leadership team in crucial agile principles.",
      author: "Alun Davies-Baker",
      position: "Engineering Leader",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
    },
    {
      quote: "What sets Justin apart is his ability to bring teams together, creating an environment where everyone can contribute their best work. His coaching approach balances technical excellence with practical leadership skills that deliver real results.",
      author: "Sarah Johnson",
      position: "CTO, TechNova Solutions",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
    },
    {
      quote: "Justin's leadership coaching transformed how our management team operates. He helped us develop a coaching mindset that empowered our teams while improving our delivery predictability. I highly recommend his professional coaching services.",
      author: "Michael Chen",
      position: "VP of Product Development",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
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
    <section id="testimonials" className="section-container bg-gradient-to-br from-green-100 to-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title text-green-800">What Our Clients Say</h2>
        <div className="relative mt-12 pb-12">
          <div className="flex justify-center">
            <div className="relative w-full">
              <div className="absolute z-10 top-0 left-0 transform -translate-x-2 -translate-y-8">
                <Quote className="w-20 h-20 text-green-600 opacity-20" />
              </div>
              {/* Testimonial Card */}
              <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 relative z-20 border border-green-100">
                <p className="text-xl md:text-2xl text-gray-700 mb-8 italic">
                  "{testimonials[currentIndex].quote}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].author}
                    className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-green-200"
                  />
                  <div>
                    <h4 className="font-bold text-green-800">{testimonials[currentIndex].author}</h4>
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
              className="p-2 rounded-full bg-white shadow-md hover:bg-green-100 transition-colors border border-green-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="text-green-700" size={24} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentIndex === index ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-green-100 transition-colors border border-green-200"
              aria-label="Next testimonial"
            >
              <ChevronRight className="text-green-700" size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
