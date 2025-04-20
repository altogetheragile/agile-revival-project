
import { useState, useEffect } from 'react';
import { Mail, MapPin, Send, Phone, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useContactInfo } from '@/hooks/useContactInfo';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const ContactSection = () => {
  const { toast } = useToast();
  const { email, phone, location, socialMedia } = useContactInfo();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("Contact section received email:", email);
    console.log("Contact section received phone:", phone);
    console.log("Contact section received socialMedia:", socialMedia);
  }, [email, phone, socialMedia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submissionData = { ...formData, recipientEmail: email };
    console.log("Sending contact form to:", email);

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "We've received your inquiry and will get back to you soon.",
      });
      setFormData({
        name: '',
        email: '',
        company: '',
        message: ''
      });
    }, 1000);
  };

  const renderEmailContact = () => {
    if (!email) {
      return (
        <div className="flex items-start gap-4">
          <Mail className="mt-1" />
          <div>
            <h4 className="font-medium">Email</h4>
            <div className="flex mt-1">
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-start gap-4">
        <Mail className="mt-1" />
        <div>
          <h4 className="font-medium">Email</h4>
          <a href={`mailto:${email}`} className="text-white/90 hover:text-white">
            {email}
          </a>
        </div>
      </div>
    );
  };

  // Social dropdown for contact
  const renderSocialMediaDropdown = () => {
    if (!socialMedia || !Object.values(socialMedia).some(link => !!link)) {
      return null;
    }
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

    return (
      <div className="mt-12">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded transition-all focus:outline-none flex items-center">
              Follow Us
              <svg className="ml-2 h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44 bg-white text-gray-800 z-50">
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
      </div>
    );
  };

  const renderLocation = () => {
    if (!location || (!location.city && !location.country)) {
      return null;
    }
    const locationDisplay = [location.city, location.country]
      .filter(Boolean)
      .join(", ");
    if (!locationDisplay) return null;

    return (
      <div className="flex items-start gap-4">
        <MapPin className="mt-1" />
        <div>
          <h4 className="font-medium">Location</h4>
          <p className="text-white/90">
            {locationDisplay}
          </p>
        </div>
      </div>
    );
  };

  const renderPhoneContact = () => {
    if (!phone) return null;
    return (
      <div className="flex items-start gap-4">
        <Phone className="mt-1" />
        <div>
          <h4 className="font-medium">Phone</h4>
          <a href={`tel:${phone}`} className="text-white/90 hover:text-white">
            {phone}
          </a>
        </div>
      </div>
    );
  };

  return (
    <section id="contact" className="section-container">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">Get in Touch</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Ready to transform your organization with agile practices? Contact us today to schedule a consultation or learn more about our services.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md animate-fade-in">
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-agile-purple"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-agile-purple"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-agile-purple"
                  placeholder="Your Company"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-agile-purple"
                  placeholder="Tell us about your agile challenges or goals..."
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`cta-button w-full flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send size={18} />
              </button>
            </form>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-gradient-to-br from-agile-purple to-agile-purple-dark text-white p-8 rounded-lg shadow-md h-full">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                {renderEmailContact()}
                {renderPhoneContact()}
                {renderLocation()}
              </div>
              {renderSocialMediaDropdown()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
