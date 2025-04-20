import React, { useEffect } from "react";
import { ChevronRight, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useContactInfo } from "@/hooks/useContactInfo";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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

  // Social dropdown
  const renderSocialMediaDropdown = () => {
    if (!socialMedia) return null;

    // Create a list of available socials
    const links = [
      socialMedia.twitter
        ? {
            key: "Twitter",
            href: socialMedia.twitter,
            icon: <Twitter className="h-5 w-5 mr-2" />,
          }
        : null,
      socialMedia.linkedin
        ? {
            key: "LinkedIn",
            href: socialMedia.linkedin,
            icon: <Linkedin className="h-5 w-5 mr-2" />,
          }
        : null,
      socialMedia.facebook
        ? {
            key: "Facebook",
            href: socialMedia.facebook,
            icon: <Facebook className="h-5 w-5 mr-2" />,
          }
        : null,
      socialMedia.instagram
        ? {
            key: "Instagram",
            href: socialMedia.instagram,
            icon: <Instagram className="h-5 w-5 mr-2" />,
          }
        : null,
      socialMedia.tiktok
        ? {
            key: "TikTok",
            href: socialMedia.tiktok,
            icon: (
              <span className="mr-2">
                {/* TikTok SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
                  <path d="M15 8h.01"/>
                  <path d="M11 16c-3 0-4-3-4-3"/>
                  <path d="M13 16c2.5 0 4-3 4-3"/>
                  <path d="M16 8c.2 0 .402.034.593.082.981.245 1.7 1.106 1.7 2.118L18 15.5c-.001 2.485-2.015 4.5-4.5 4.5-1.863 0-3.466-1.128-4.153-2.738A4.454 4.454 0 0 1 9 15.5c0-2.485 2.015-4.5 4.5-4.5.164 0 .326.009.484.026.658.07 1.209.558 1.302 1.192M16 8V4"/>
                </svg>
              </span>
            ),
          }
        : null,
      socialMedia.bluesky
        ? {
            key: "Bluesky",
            href: socialMedia.bluesky,
            icon: (
              <span className="mr-2">
                {/* Bluesky SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 19.7778h20L12 2Z"/>
                  <path d="M12 6.77783L7 15.5557h10L12 6.77783Z"/>
                  <path d="M12 11.5557L9.5 15.5557h5l-2.5-4Z"/>
                </svg>
              </span>
            ),
          }
        : null,
    ].filter(Boolean);

    if (links.length === 0) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center px-4 py-2 bg-agile-purple rounded text-white hover:bg-agile-purple-dark transition-all focus:outline-none">
            Follow Us
            <svg className="ml-2 h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 bg-white text-gray-800 z-50">
          {/* 2 column grid for items */}
          <div className="grid grid-cols-2 gap-1">
            {links.map(link => (
              <DropdownMenuItem key={link.key} asChild>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  {link.icon}
                  <span>{link.key}</span>
                </a>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
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
            {renderSocialMediaDropdown()}
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
