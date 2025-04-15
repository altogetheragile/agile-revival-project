
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollToTop from "@/components/layout/ScrollToTop";

const TeamCoaching = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center">
              <div className="bg-agile-purple-light p-3 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Users className="text-agile-purple" size={24} />
              </div>
              <h1 className="text-4xl font-bold text-agile-purple-dark">Team Coaching</h1>
            </div>
            
            <div className="aspect-w-16 aspect-h-9 mb-8 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
                alt="Team Coaching Session" 
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4 text-agile-purple-dark">Elevate Your Team's Performance</h2>
              <p className="mb-4">
                Our team coaching service provides hands-on coaching for agile teams using Scrum, Kanban, or hybrid approaches. We focus on improving collaboration, communication, and delivery practices to help your team achieve exceptional results.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6 text-agile-purple-dark">What Your Team Will Gain</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Improved team dynamics and collaboration</li>
                <li>More effective agile ceremonies and practices</li>
                <li>Enhanced problem-solving and decision-making capabilities</li>
                <li>Better understanding of roles and responsibilities</li>
                <li>Sustainable pace and improved work-life balance</li>
                <li>Higher quality deliverables with fewer defects</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 mt-6 text-agile-purple-dark">Our Approach</h3>
              <p className="mb-4">
                We begin by observing your team in action and identifying opportunities for improvement. Our coaches then work alongside your team, providing real-time guidance and feedback as they navigate their day-to-day work.
              </p>
              <p className="mb-6">
                Our coaching includes facilitating key ceremonies, providing training on specific practices, and helping the team reflect on and improve their processes. We adapt our approach based on your team's unique context and challenges.
              </p>
              
              <div className="bg-agile-purple-light p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold mb-3 text-agile-purple-dark">Ready to Transform Your Team?</h3>
                <p className="mb-4">
                  Our team coaching has helped teams across various industries improve their collaboration, delivery, and overall effectiveness.
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

export default TeamCoaching;
