
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollToTop from "@/components/layout/ScrollToTop";

const LeadershipCoaching = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center">
              <div className="bg-agile-purple-light p-3 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Compass className="text-agile-purple" size={24} />
              </div>
              <h1 className="text-4xl font-bold text-agile-purple-dark">Leadership Coaching</h1>
            </div>
            
            <div className="aspect-w-16 aspect-h-9 mb-8 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
                alt="Leadership Coaching Session" 
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4 text-agile-purple-dark">Transform Your Leadership Approach</h2>
              <p className="mb-4">
                Our leadership coaching service provides one-on-one guidance for leaders to develop an agile mindset and effectively support self-organizing teams. We focus on helping you evolve your leadership style to meet the challenges of today's rapidly changing business environment.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6 text-agile-purple-dark">What You'll Gain</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Clear understanding of servant leadership principles</li>
                <li>Practical tools to foster team autonomy and innovation</li>
                <li>Techniques for managing organizational change</li>
                <li>Methods to balance strategic vision with day-to-day execution</li>
                <li>Frameworks for effective decision-making in complex environments</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6 text-agile-purple-dark">Our Approach</h3>
              <p className="mb-4">
                We begin with a thorough assessment of your current leadership style, challenges, and goals. Our experienced coaches then develop a personalized coaching plan designed to address your specific needs and organizational context.
              </p>
              <p className="mb-6">
                Coaching sessions are typically held bi-weekly or monthly, with ongoing support provided between sessions. We use a blend of teaching, questioning, and reflection to help you discover insights and develop new capabilities.
              </p>
              
              <div className="bg-agile-purple-light p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold mb-3 text-agile-purple-dark">Ready to Transform Your Leadership?</h3>
                <p className="mb-4">
                  Our leadership coaching has helped executives and managers across various industries develop the mindset and skills needed for agile leadership.
                </p>
                <Link to="/#contact" className="cta-button flex items-center justify-center gap-2 max-w-xs">
                  Book a Consultation
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

export default LeadershipCoaching;
