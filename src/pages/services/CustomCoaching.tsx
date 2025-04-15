
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Puzzle } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollToTop from "@/components/layout/ScrollToTop";

const CustomCoaching = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center">
              <div className="bg-agile-purple-light p-3 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Puzzle className="text-agile-purple" size={24} />
              </div>
              <h1 className="text-4xl font-bold text-agile-purple-dark">Custom Coaching Solutions</h1>
            </div>
            
            <div className="aspect-w-16 aspect-h-9 mb-8 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
                alt="Custom Coaching Session" 
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4 text-agile-purple-dark">Tailored Solutions for Your Unique Challenges</h2>
              <p className="mb-4">
                Our custom coaching solutions are designed to address your organization's unique challenges and goals. We work closely with you to develop a coaching program that meets your specific needs, whether you're just starting your agile journey or looking to take your mature agile practices to the next level.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6 text-agile-purple-dark">What You'll Gain</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>A coaching approach perfectly tailored to your context</li>
                <li>Solutions that address your specific pain points</li>
                <li>Flexible support that adapts as your needs evolve</li>
                <li>Integrated approach that considers your entire organization</li>
                <li>Sustainable practices that continue after the coaching engagement ends</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6 text-agile-purple-dark">Our Approach</h3>
              <p className="mb-4">
                We begin with a thorough discovery process to understand your current situation, challenges, goals, and culture. Based on this understanding, we design a customized coaching program that might include elements of leadership coaching, team coaching, training, and facilitation.
              </p>
              <p className="mb-6">
                Throughout the engagement, we regularly assess progress and adjust our approach as needed. Our goal is to build your organization's internal capabilities so that you can sustain and continue to improve your agile practices long after our engagement ends.
              </p>
              
              <div className="bg-agile-purple-light p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold mb-3 text-agile-purple-dark">Ready for a Customized Solution?</h3>
                <p className="mb-4">
                  Our custom coaching solutions have helped organizations of all sizes address their unique challenges and achieve their specific agile goals.
                </p>
                <Link to="/#contact" className="cta-button flex items-center justify-center gap-2 max-w-xs">
                  Book a Discovery Session
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default CustomCoaching;
