
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollToTop from "@/components/layout/ScrollToTop";

const AgileFacilitation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center">
              <div className="bg-agile-purple-light p-3 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Activity className="text-agile-purple" size={24} />
              </div>
              <h1 className="text-4xl font-bold text-agile-purple-dark">Agile Facilitation</h1>
            </div>
            
            <div className="aspect-w-16 aspect-h-9 mb-8 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
                alt="Agile Facilitation Session" 
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4 text-agile-purple-dark">Expert Facilitation for Maximum Impact</h2>
              <p className="mb-4">
                Our agile facilitation service provides expert guidance for key agile ceremonies, retrospectives, and strategic planning sessions. We help ensure these crucial meetings are productive, engaging, and lead to meaningful outcomes.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6 text-agile-purple-dark">What You'll Gain</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>More productive and engaging meetings</li>
                <li>Clearer action items and follow-through</li>
                <li>Improved participation from all team members</li>
                <li>Better decision-making processes</li>
                <li>More creative problem-solving approaches</li>
                <li>Increased team alignment and commitment</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6 text-agile-purple-dark">Our Approach</h3>
              <p className="mb-4">
                We work closely with you to understand the specific goals and challenges of each session we facilitate. Our expert facilitators then design an approach tailored to your needs, using proven techniques to ensure all voices are heard and clear outcomes are achieved.
              </p>
              <p className="mb-6">
                Whether it's a one-time strategic planning session or ongoing facilitation of agile ceremonies, we bring structure, energy, and expertise to help your team make the most of their time together.
              </p>
              
              <div className="bg-agile-purple-light p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold mb-3 text-agile-purple-dark">Ready for More Effective Meetings?</h3>
                <p className="mb-4">
                  Our facilitation services have helped teams and organizations run more effective meetings that lead to clear decisions and meaningful action.
                </p>
                <Link to="/#contact" className="cta-button flex items-center justify-center gap-2 max-w-xs">
                  Book a Session
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

export default AgileFacilitation;
