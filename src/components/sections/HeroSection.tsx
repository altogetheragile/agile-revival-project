
import { ArrowRightCircle, CircleArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Parallax background */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80')",
          transform: `translateY(${scrollPosition * 0.3}px)`,
          backgroundAttachment: "fixed"
        }}
      />
      
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-gray-100/10 z-10"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/70 backdrop-blur-sm px-8 py-12 rounded-lg shadow-xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-agile-purple">
              Agile Training & Coaching
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-agile-purple-dark">
              Grow Better Together
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
              We help leaders and teams build sustainable agility through expert coaching, practical training, and collaborative development approaches.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                to="/training-schedule" 
                className="cta-button flex items-center justify-center gap-2"
              >
                View Courses
                <ArrowRightCircle size={20} />
              </Link>
              <a 
                href="#contact" 
                className="secondary-button flex items-center justify-center gap-2"
              >
                Get in Touch
                <CircleArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
