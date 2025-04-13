
import { ArrowRightCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center pt-16 bg-gradient-to-br from-white via-agile-purple-light to-green-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-10 mb-10 md:mb-0 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-agile-purple-dark to-agile-purple">
              Transform Your Organization with Agile
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              We help teams and organizations embrace agility, improve collaboration, and sustainably deliver exceptional value to customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#services" className="cta-button flex items-center justify-center gap-2">
                Explore Services
                <ArrowRightCircle size={20} />
              </a>
              <a href="#contact" className="secondary-button flex items-center justify-center">
                Schedule a Consultation
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-agile-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-agile-purple-dark rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-agile-purple-light rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
              <img 
                src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
                alt="Forest bathed in sunlight"
                className="relative rounded-lg shadow-2xl z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
