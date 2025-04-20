import { useState, useEffect } from 'react';
import { Mail, MapPin, Send, Phone, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useContactInfo } from '@/hooks/useContactInfo';
import { Skeleton } from '@/components/ui/skeleton';

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

  // Debug logging
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
    
    // Include recipient email from site settings
    const submissionData = {
      ...formData,
      recipientEmail: email, // Send to the contact email from site settings
    };
    
    console.log("Sending contact form to:", email);
    
    // Simulate form submission
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
  
  // Only show social media icons if they have values
  const renderSocialMedia = () => {
    // If socialMedia is undefined or no social media links are set
    if (!socialMedia || !Object.values(socialMedia).some(link => !!link)) {
      return null;
    }
    
    return (
      <div className="mt-12">
        <h4 className="font-medium mb-4">Follow Us</h4>
        <div className="flex gap-4">
          {socialMedia.twitter && (
            <a href={socialMedia.twitter} className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">Twitter</span>
              <Twitter className="w-5 h-5" />
            </a>
          )}
          {socialMedia.linkedin && (
            <a href={socialMedia.linkedin} className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {socialMedia.facebook && (
            <a href={socialMedia.facebook} className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">Facebook</span>
              <Facebook className="w-5 h-5" />
            </a>
          )}
          {socialMedia.instagram && (
            <a href={socialMedia.instagram} className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">Instagram</span>
              <Instagram className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    );
  };
  
  // Only show location if there's data available
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
  
  // Render phone contact info
  const renderPhoneContact = () => {
    if (!phone) {
      return null;
    }
    
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
              
              {renderSocialMedia()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
