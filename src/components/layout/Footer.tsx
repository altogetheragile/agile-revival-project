import React, { useEffect } from "react";
import { ChevronRight, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useContactInfo } from "@/hooks/useContactInfo";
import { Skeleton } from "@/components/ui/skeleton";

const Footer = () => {
  const { email, phone, location, socialMedia } = useContactInfo();
  
  // Debug logging
  useEffect(() => {
    console.log("Footer received contact info:", { email, phone, location, socialMedia });
  }, [email, phone, location, socialMedia]);
  
  // Improved rendering for email with better loading state handling
  const renderEmail = () => {
    if (email === undefined || email === null || email === '') {
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

  const renderLocation = () => {
    if (!location) return null;
    const { address, city, country } = location;
    
    // Only show location if we have at least one field filled
    if (!address && !city && !country) return null;
    
    return (
      <>
        {address && <p>{address}</p>}
        {(city || country) && <p>{[city, country].filter(Boolean).join(", ")}</p>}
      </>
    );
  };

  // Only show social media icons if they have values
  const renderSocialMedia = () => {
    if (!socialMedia) return null;

    return (
      <div className="flex space-x-4">
        {socialMedia.twitter && (
          <a href={socialMedia.twitter} className="text-gray-400 hover:text-agile-purple" target="_blank" rel="noopener noreferrer">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </a>
        )}
        {socialMedia.linkedin && (
          <a href={socialMedia.linkedin} className="text-gray-400 hover:text-agile-purple" target="_blank" rel="noopener noreferrer">
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-6 w-6" />
          </a>
        )}
        {socialMedia.facebook && (
          <a href={socialMedia.facebook} className="text-gray-400 hover:text-agile-purple" target="_blank" rel="noopener noreferrer">
            <span className="sr-only">Facebook</span>
            <Facebook className="h-6 w-6" />
          </a>
        )}
        {socialMedia.instagram && (
          <a href={socialMedia.instagram} className="text-gray-400 hover:text-agile-purple" target="_blank" rel="noopener noreferrer">
            <span className="sr-only">Instagram</span>
            <Instagram className="h-6 w-6" />
          </a>
        )}
      </div>
    );
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
            {renderSocialMedia()}
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
              {renderLocation()}
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
