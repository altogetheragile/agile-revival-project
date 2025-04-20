import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useContactInfo } from "@/hooks/useContactInfo";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Footer = () => {
  const { email, phone } = useContactInfo();
  
  // Debug logging
  useEffect(() => {
    console.log("Footer received email:", email);
    console.log("Footer received phone:", phone);
  }, [email, phone]);
  
  const renderEmail = () => {
    if (!email) {
      return (
        <div className="flex items-center gap-2">
          <span>Email: </span>
          <Skeleton className="h-4 w-40" />
        </div>
      );
    }
    return <p>Email: {email}</p>;
  };

  const renderPhone = () => {
    if (!phone) return null;
    return <p>Phone: {phone}</p>;
  };
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">
              Altogether<span className="text-agile-purple">Agile</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Transforming organizations through agile methodologies and mindsets.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-agile-purple">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-agile-purple">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/services/leadership-coaching" className="text-gray-400 hover:text-agile-purple flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  Leadership Coaching
                </Link>
              </li>
              <li>
                <Link to="/services/team-coaching" className="text-gray-400 hover:text-agile-purple flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  Team Coaching
                </Link>
              </li>
              <li>
                <Link to="/training-schedule" className="text-gray-400 hover:text-agile-purple flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  Agile Training
                </Link>
              </li>
              <li>
                <Link to="/services/agile-facilitation" className="text-gray-400 hover:text-agile-purple flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  Agile Facilitation
                </Link>
              </li>
              <li>
                <Link to="/services/performance-metrics" className="text-gray-400 hover:text-agile-purple flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  Performance Metrics
                </Link>
              </li>
              <li>
                <Link to="/services/custom-coaching" className="text-gray-400 hover:text-agile-purple flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  Custom Coaching Solutions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-gray-400 hover:text-agile-purple flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-agile-purple flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-agile-purple flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  Services
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-400 hover:text-agile-purple flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  Client Stories
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-agile-purple flex items-center">
                  <ChevronRight size={16} className="mr-1" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <address className="not-italic text-gray-400 space-y-3">
              <p>London, United Kingdom</p>
              {renderEmail()}
              {renderPhone()}
            </address>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Altogether Agile. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
