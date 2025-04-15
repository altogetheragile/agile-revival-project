
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollToTop from "@/components/layout/ScrollToTop";

const PerformanceMetrics = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center">
              <div className="bg-agile-purple-light p-3 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <BarChart3 className="text-agile-purple" size={24} />
              </div>
              <h1 className="text-4xl font-bold text-agile-purple-dark">Performance Metrics</h1>
            </div>
            
            <div className="aspect-w-16 aspect-h-9 mb-8 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
                alt="Performance Metrics Dashboard" 
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4 text-agile-purple-dark">Measure What Matters</h2>
              <p className="mb-4">
                Our performance metrics service helps you develop meaningful measurement approaches that focus on outcomes and support continuous improvement. We help you move beyond vanity metrics to track what truly drives value for your customers and organization.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6 text-agile-purple-dark">What You'll Gain</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Clear alignment between metrics and business goals</li>
                <li>Focus on outcome measures rather than output</li>
                <li>Better insight into team and organizational performance</li>
                <li>Data-driven approach to continuous improvement</li>
                <li>Enhanced transparency and accountability</li>
                <li>Balanced metrics that avoid unintended consequences</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6 text-agile-purple-dark">Our Approach</h3>
              <p className="mb-4">
                We begin by understanding your organization's vision, strategy, and goals. From there, we work with your teams to identify the metrics that best reflect progress toward those goals and design simple ways to track and visualize them.
              </p>
              <p className="mb-6">
                Our approach emphasizes simplicity, actionability, and alignment. We help you develop metrics that provide genuine insight and drive meaningful improvement, while avoiding common pitfalls like metric manipulation and perverse incentives.
              </p>
              
              <div className="bg-agile-purple-light p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold mb-3 text-agile-purple-dark">Ready to Measure What Matters?</h3>
                <p className="mb-4">
                  Our performance metrics service has helped organizations gain clarity on their performance and make more informed decisions about where to focus their improvement efforts.
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

export default PerformanceMetrics;
