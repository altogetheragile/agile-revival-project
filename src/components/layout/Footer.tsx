
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
        {socialMedia.tiktok && (
          <a href={socialMedia.tiktok} className="text-gray-400 hover:text-agile-purple" target="_blank" rel="noopener noreferrer">
            <span className="sr-only">TikTok</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
              <path d="M15 8h.01"/>
              <path d="M11 16c-3 0-4-3-4-3"/>
              <path d="M13 16c2.5 0 4-3 4-3"/>
              <path d="M16 8c.2 0 .402.034.593.082.981.245 1.7 1.106 1.7 2.118L18 15.5c-.001 2.485-2.015 4.5-4.5 4.5-1.863 0-3.466-1.128-4.153-2.738A4.454 4.454 0 0 1 9 15.5c0-2.485 2.015-4.5 4.5-4.5.164 0 .326.009.484.026.658.07 1.209.558 1.302 1.192M16 8V4"/>
            </svg>
          </a>
        )}
        {socialMedia.bluesky && (
          <a href={socialMedia.bluesky} className="text-gray-400 hover:text-agile-purple" target="_blank" rel="noopener noreferrer">
            <span className="sr-only">Bluesky</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 19.7778h20L12 2Z"/>
              <path d="M12 6.77783L7 15.5557h10L12 6.77783Z"/>
              <path d="M12 11.5557L9.5 15.5557h5l-2.5-4Z"/>
            </svg>
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
